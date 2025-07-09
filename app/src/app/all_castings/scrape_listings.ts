import { ScraperResult } from './index.js'
import { chromium, Browser } from 'playwright'
import { z } from 'zod'
import LLMScraper from 'llm-scraper'
import logger from '../../config/logger.js'
import { llm } from '../../config/llm.js'
import { parseDateToTimestamp, getCurrentTimestamp, getFutureDate } from '../../utils/dateUtils.js'
import { CDUser, rateDescription, snr_type, CategoryEnum, MappedJob } from '../../types/casting.js'
import { searchCDByName } from '../../helpers/searchCD.js'
import { getUpdatedNameAndDescription } from '../../helpers/getUpdatedNameDescriptionProjectQuality.js'
import dotenv from 'dotenv'
import { createCDLog } from '../../helpers/createCDLog.js'
import { addProjectToET } from '../../helpers/addProjectToET.js'
import { addRoles } from '../../helpers/addRoles.js'
import { addProjectApps } from '../../helpers/addProjectApps.js'
import { rolesSchema } from '../../helpers/addRoles.js'
import { Role } from '../../types/roles.js'
import { extractAuditionDate, ExtractedAuditionDate } from '../auditions_free/scrape_listing.js'
dotenv.config()

const baseUrl = 'https://allcasting.com'
const categoryKeys = Object.keys(CategoryEnum).filter(key => key !== '') as [keyof typeof CategoryEnum, ...(keyof typeof CategoryEnum)[]];
const rate_des_keys = Object.keys(rateDescription).filter(key => key !== 'n/a') as [keyof typeof rateDescription, ...(keyof typeof rateDescription)[]];
const snr_type_keys = Object.keys(snr_type).filter(key => key !== 'n/a') as [keyof typeof snr_type, ...(keyof typeof snr_type)[]];
const browser = await chromium.launch()

export interface ScrapedJob {
    name_original: string,
    expiration_date: string,
    description: string[],
    location: string,
    category: string,
    casting_director: string,
    rate: number,
    rate_des: string,
    snr_type: string,
    union_job: boolean,
    roles: Role[],
}

function mapJobToDatabase(job: ScrapedJob, user: CDUser, updated_name: string, updated_description: string, audition_timestamp: number = 0, scraped_url: string, project_quality: number, expiration_date: number) {
    const mapped: MappedJob = {
        name_original: job.name_original,
        name: updated_name,
        project: updated_name,
        address2: baseUrl + scraped_url,
        rate: job.rate,
        rate_des: rateDescription[job.rate_des],
        des: updated_description,
        qlty_level: project_quality,
        aud_timestamp: audition_timestamp,
        asap: expiration_date,
        date_created: getCurrentTimestamp(),
        last_modified: getCurrentTimestamp(),
        status: 1,
        location: job.location,
        market: job.location,
        cat: CategoryEnum[job.category],
        required_phone: '0',
        required_photo: '0',
        snr: snr_type[job.snr_type],
        user_id: user.id,
        snr_email: user.email,
        union2: job.union_job ? 1 : 0,
        sub_timestamp: getCurrentTimestamp(),
        source: scraped_url,
        expected_time: '0',
        paid: 1,
        notify_through: '0'
    }
    return mapped;
}

export async function scrapeListing(listing: ScraperResult) {
    const page = await browser.newPage();
    
    try {
        logger.info(`Scraping listing ${listing.name}, Link: ${baseUrl + listing.url}`)
        await page.goto(baseUrl + listing.url)
        await page.waitForLoadState('networkidle')
        const scraper = new LLMScraper(llm)
        const schema = z.object({
                name_original: z.string(),
                expiration_date: z.string().describe("The date should be in YYYY-MM-DD HH:mm:ss format").default(getFutureDate(new Date(), 30).toString()),
                description: z.array(z.string()),
                location: z.string(),
                category: z.enum(categoryKeys),
                casting_director: z.string(),
                roles: z.array(rolesSchema),
                rate: z.number().default(262).describe("The rate should be a number. If no rate is provided, use 262."),
                rate_des: z.enum(rate_des_keys).describe("The rate description should be a string. If no rate description is provided, use 'negotiable'"),
                snr_type: z.enum(snr_type_keys),
                union_job: z.boolean().default(false),
            })
            .describe("Extact all the information about the job. Do not wrap any text overflow in elipses or other symbols. If date posted is not provided, use today's date. The expiration date should be after the date posted. If expiration date is not provided, use 30 days from today's date. Return the unix timestamp for the expiration date. Rate the quality of the project on a scale of 4-6. 6 has the best actors, pays well. 4 has average actors, pays average. 5 is somewhere in between. If any information is not provided, use the default value. The job is Open Call if and only if Date of the audition is provided. Project name is the name of the movie/show/project.");
        
        

        const { data } = (await scraper.run(page, schema, { format: 'html', maxTokens: 20000 })) as unknown as {data: ScrapedJob};
        await page.close()
        let aud_timestamp = 0;
        if (data.snr_type === "Open Call") {
            logger.info('Extracting audition date for Open Call');
            const snr_result = await extractAuditionDate(data.description) as unknown as ExtractedAuditionDate;
            aud_timestamp = parseDateToTimestamp(snr_result.audition_date);
            logger.info(`Audition timestamp: ${aud_timestamp}`);
        }

        const user = await searchCDByName(data.casting_director)
        const updatedNameDescriptionProjectQuality = await getUpdatedNameAndDescription(data.name_original, data.description)
        const mappedJob = mapJobToDatabase(data, user, updatedNameDescriptionProjectQuality.name, updatedNameDescriptionProjectQuality.description, aud_timestamp, listing.url, updatedNameDescriptionProjectQuality.project_quality, parseDateToTimestamp(data.expiration_date))
        
        // Add project to ET
        await addProjectToET(mappedJob)
        // Add roles to ET
        await addRoles(mappedJob.name, data.description.join(" "), baseUrl + listing.url);
        // Add project apps
        await addProjectApps(mappedJob.name, listing.url)
        // Create CD log
        await createCDLog(user.id, JSON.stringify({scraped_url: baseUrl + listing.url, ...data}))
        logger.info('Project added successfully: ' + mappedJob.name);
        await page.close()

// process.exit(0);
    }
    catch (error) {
        logger.error('Error during scraping:', error)
    } 
}
    
