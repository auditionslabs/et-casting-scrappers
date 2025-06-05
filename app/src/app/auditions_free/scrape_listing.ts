import { chromium } from 'playwright'
import { z } from 'zod'
import LLMScraper from 'llm-scraper'
import logger from '../../config/logger.js'
import { llm } from '../../config/llm.js'
import { getFutureDate, parseDateToTimestamp, getCurrentTimestamp } from '../../utils/dateUtils.js'
import { CDUser, rateDescription, snr_type, CategoryEnum, MappedJob } from '../../types/casting.js'
import { searchCD } from '../../helpers/searchCD.js'
import { generateObject } from 'ai'
import { getUpdatedNameAndDescription, type UpdatedNameDescriptionProjectQuality } from '../../helpers/getUpdatedNameDescriptionProjectQuality.js'
import { searchDuplicateProject } from '../../helpers/checkDuplicateProject.js'
import dotenv from 'dotenv'
import { createCDLog } from '../../helpers/createCDLog.js'
import { addProjectToET } from '../../helpers/addProjectToET.js'
import { addRoles } from '../../helpers/addRoles.js'
import { addProjectApps } from '../../helpers/addProjectApps.js'
dotenv.config()

const search_base_url = process.env.SEARCH_BASE_URL || "https://www.bing.com/search"

export interface ScrapedJob {
    name_original: string,
    description: string[],
    location: string,
    date_posted: string,
    application_url: string,
    snr_type: string,
    compensation: string,
    rate_des: string,
    project_quality: number,
    category: string,
    expiration_date: number,
    union_job: boolean,
    rate: number,
    project_name: string,
    application_email: string
}
export interface ScrapedJob1 {
    results: ScrapedJob[]
}

export interface ScrapedJob2 {
    result: {
        casting_director_name: string,
        casting_company_name: string,
    }
}

interface ExtractedAuditionDate {
    audition_date: string,
}

interface mappedJob {
    name_original: string,
    name: string,
    project: string,
    des: string,
    aud_timestamp?: number,
    asap: number,
    rate_des: number,
    qlty_level: number,
    date_created: number,
    last_modified: number,
    status: number,
    address2: string,
    rate: number,
    location: string,
    market: string,
    cat: number,
    required_phone: string,
    required_photo: string,
    user_id: number,
    snr: number,
    snr_email: string,
    union2: number,
    sub_timestamp: number,
    source: string,
    expected_time: string,
    paid: number,
    notify_through: string,
    [key: string]: string | number | undefined
}


function mapJobToDatabase(job: ScrapedJob, user: CDUser, updated_name: string, updated_description: string, audition_timestamp: number = 0, scraped_url: string, project_quality: number, expiration_date: number) {
    const mapped: mappedJob = {
        name_original: job.name_original,
        name: updated_name,
        project: updated_name,
        address2: scraped_url,
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


// if casting is an open call, then we extract the audition date from the description
export async function extractAuditionDate(description: string[]) {
    const schema = z.object({
        audition_date: z.string(),
    })
    const result = await generateObject({
        model: llm,
        schema: schema,
        prompt: `Extract the audition date from the description: ${description}. Use the date in the format YYYY-MM-DD. If there is no year provided use current year. Current year is: ${new Date().getFullYear()}`
    })
    // console.log(JSON.stringify(result, null, 2));
    return result.object.audition_date;
}

async function extractExpirationDate(description: string) {
    const schema = z.object({
        expiration_date: z.string(),
    })
    const result = await generateObject({
        model: llm,
        schema: schema,
        prompt: `Extract the expiration date from the description: ${description}. Use the date in the format YYYY-MM-DD. If there is no year provided use current year. If there is no expiration date provided, use 30 days from today's date.
        
        Today's date is: ${new Date().toISOString()}`
    })
    // console.log(JSON.stringify(result, null, 2));
    return result.object.expiration_date;
}

export async function scrapeListing(url: string) {
    let browser = null;
    let page = null;
    let aud_timestamp = 0;
    let user: CDUser;
    try {
        logger.info(`Starting to scrape listing from URL: ${url}`);
        browser = await chromium.launch();
        page = await browser.newPage();
        await page.goto(url);
        logger.info('Page loaded successfully');

        const scraper = new LLMScraper(llm);
        const categoryKeys = Object.keys(CategoryEnum).filter(key => key !== '') as [keyof typeof CategoryEnum, ...(keyof typeof CategoryEnum)[]];
        const rate_des_keys = Object.keys(rateDescription).filter(key => key !== 'n/a') as [keyof typeof rateDescription, ...(keyof typeof rateDescription)[]];
        const snr_type_keys = Object.keys(snr_type).filter(key => key !== 'n/a') as [keyof typeof snr_type, ...(keyof typeof snr_type)[]];

        const schema = z.object({
            results: z.array(
                z.object({
                    name_original: z.string(),
                    description: z.array(z.string()),
                    location: z.string(),
                    date_posted: z.string(),
                    application_url: z.string(),
                    snr_type: z.enum(snr_type_keys),
                    compensation: z.string().default("262"),
                    rate_des: z.enum(rate_des_keys),
                    project_quality: z.number().default(0),
                    category: z.enum(categoryKeys),
                    union_job: z.boolean(),
                    rate: z.number().default(262),
                    project_name: z.string(),
                    application_email: z.string().optional()
                })
            )
        })
        .describe(`All the information about the job. Do not wrap any text overflow in elipses or other symbols. If date posted is not provided, use today's date. The expiration date should be after the date posted. If expiration date is not provided, use 30 days from today's date. Return the unix timestamp for the expiration date. Rate the quality of the project on a scale of 4-6. 6 has the best actors, pays well. 4 has average actors, pays average. 5 is somewhere in between. If any information is not provided, use the default value. The job is Open Call if and only if Date of the audition is provided. Project name is the name of the movie/show/project.
            
        Today's date is: ${new Date().toISOString()}
        
        If an application email is found in the description, use it as the application email. If no application email is found, use not_found.
        `);

        logger.info('Running scraper to extract job details');
        const result = await scraper.run(page, schema, { format: 'html', maxTokens: 20000 }) as unknown as { data: ScrapedJob1 }
        logger.info("Scraper Result:\n" + JSON.stringify(result.data, null, 2));

        let job = result.data.results[0];
        logger.info(`Checking for duplicate project: ${job.name_original}`);

        const duplicate_project = await searchDuplicateProject(job.name_original, job.application_url);
        if (!duplicate_project) {
            logger.info('No duplicate found, proceeding with scraping');
            const search_params = new URLSearchParams({
                q: "Who is the casting director for " + job.project_name + "?"
            });

            const search_url = search_base_url + "?" + search_params.toString();
            logger.info(`Searching for casting director at: ${search_url}`);
            await page.goto(search_url);
            await page.waitForLoadState('networkidle');

            const casting_director_schema = z.object({
                result: z.object({
                    casting_company_name: z.string().default("not_found"),
                    casting_director_name: z.string().default("not_found")
                })
                .describe(`Extract the casting company name and casting director name from the search results. If the casting company name is not found, return "not_found".`)
            })

            const casting_director_result = await scraper.run(page, casting_director_schema, { format: 'html', maxTokens: 20000 }) as unknown as { data: ScrapedJob2 }

            // console.log(JSON.stringify(casting_director_result, null, 2));
            logger.info("Casting Director Result:\n" + JSON.stringify(casting_director_result.data, null, 2));
            // process.exit(0);
            
            if (casting_director_result.data.result.casting_company_name !== "not_found") {
                logger.info(`Searching for CD user: ${casting_director_result.data.result.casting_company_name}`);
                user = await searchCD(casting_director_result.data.result.casting_company_name) as CDUser
                logger.info("CD User found:\n" + JSON.stringify(user, null, 2));
            }
            else {
                logger.info('No casting company found, using default user');
                if (job.application_email !== "not_found") {
                    user = {
                        id: 1,
                        email: job.application_email,
                    }
                }
                else {
                    user = {
                        id: 1,
                        email: "booking@exploretalent.com",
                    }
                }
            }

            // console.log(JSON.stringify(user, null, 2));
            // process.exit(0);
            if (result.data.results[0].snr_type === "Open Call") {
                logger.info('Extracting audition date for Open Call');
                const snr_result = await extractAuditionDate(result.data.results[0].description) as unknown as ExtractedAuditionDate;
                aud_timestamp = parseDateToTimestamp(snr_result.audition_date);
                logger.info(`Audition timestamp: ${aud_timestamp}`);
            }

            logger.info('Getting updated name and description');
            const updatedNameDescriptionProjectQuality = await getUpdatedNameAndDescription(result.data.results[0].name_original, result.data.results[0].description) as unknown as UpdatedNameDescriptionProjectQuality;
            logger.info("Updated name and description:\n" + JSON.stringify(updatedNameDescriptionProjectQuality, null, 2));

            createCDLog(user.id, JSON.stringify({scraped_url:url, ...updatedNameDescriptionProjectQuality, ...job, aud_timestamp:aud_timestamp }))

            logger.info('Mapping job to database format');

            const expiration_date = await extractExpirationDate(result.data.results[0].description.join(" "));
            const mappedJob = mapJobToDatabase(job, user, updatedNameDescriptionProjectQuality.name, updatedNameDescriptionProjectQuality.description, aud_timestamp, url, updatedNameDescriptionProjectQuality.project_quality, parseDateToTimestamp(expiration_date))
            logger.info("Mapped job:\n" + JSON.stringify(mappedJob, null, 2));

            logger.info('Adding project to Explore Talent');
            // console.log(JSON.stringify(mappedJob, null, 2));
            // process.exit(0);
            await addProjectToET(mappedJob as MappedJob)
            await addRoles(mappedJob.name,job.description.join(" "), url)
            await addProjectApps(mappedJob.name, url)
            logger.info('Project added successfully');
        } else {
            logger.info('Duplicate project found, skipping');
        }

    } catch (error) {
        logger.error('Error during scraping:', error)
        throw error
    } finally {
        if (page) await page.close()
        if (browser) await browser.close()
        logger.info("Browser closed")
    }
}
