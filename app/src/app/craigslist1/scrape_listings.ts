import { chromium } from 'playwright'
import { z } from 'zod'
import LLMScraper from 'llm-scraper'
import logger from '../../config/logger.js'
import { CategoryEnum, CDUser, MappedJob } from '../../types/casting.js'
import { createCDLog } from '../../helpers/createCDLog.js'
import { addRoles } from '../../helpers/addRoles.js'
import { addProjectToET } from '../../helpers/addProjectToET.js'
import { addProjectApps } from '../../helpers/addProjectApps.js'
import { rateDescription } from '../../types/casting.js'
import { llm } from '../../config/llm.js'
import { type UpdatedNameDescriptionProjectQuality, getUpdatedNameAndDescription } from '../../helpers/getUpdatedNameDescriptionProjectQuality.js'
import { getFutureDate } from '../../utils/dateUtils.js'
import { getJobReplayEmail } from './helper.js'


export type ScrapedJob = {
	title: string;
	job_url: string;
	location: string;
}

export type Listing = {
	title: string;
	location: string;
	price: string;
	postingDate: string;
	job_url: string;
	job_description: string[];
	company_name: string;
	union_job: boolean;
	compensation: string;
	production_type: string;
	job_type: string;
	skills: string;
	date_posted: string;
	project_quality: number;
	rate_des: string;
	original_job_id: number;
}

type ScrapedListing = {
	result: Listing
}

function getDomain(url: string): string | null {
	const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/:?#]+)/i;
	const match = url.match(regex);
	return match ? match[1] : null;
}

async function mapJobToDatabase(listing: Listing & { updated_title: string, updated_description: string }, user: { id: number, email: string }) {
	const currentTime = Math.floor(Date.now() / 1000);

	const mapped: MappedJob = {
		name: listing.updated_title,
		name_original: listing.title,
		project: listing.updated_title,
		address2: listing.job_url,
		location: listing.location,
		cat: CategoryEnum[listing.production_type] || 0,
		rate: parseInt(listing.price.replace(/[^0-9]/g, '')) || 262,
		rate_des: rateDescription[listing.rate_des] || 0,
		qlty_level: listing.project_quality,
		des: listing.updated_description,
		union2: listing.union_job ? 1 : 0,
		sub_timestamp: currentTime,
		date_created: currentTime,
		last_modified: currentTime,
		status: 1,
		asap: (Math.floor(new Date(listing.date_posted).getTime() / 1000)).toString(),
		source: getDomain(listing.job_url) || listing.job_url,
		required_phone: '0',
		required_photo: '0',
		expected_time: '0',
		paid: listing.compensation === 'Paid' ? 1 : 0,
		notify_through: '0',
		user_id: user.id,
		snr: 1,
		snr_email: user.email,
		market: listing.location,
	}
	return mapped
}

export async function scrapeListing(listing: ScrapedJob) {
	let browser = null;
	let page = null;
	try {
		browser = await chromium.launch({ headless: false });
		page = await browser.newPage();
		await page.goto(listing.job_url);
		await page.waitForLoadState('networkidle');
		logger.info('Page loaded')

		// Create a new LLMScraper
		const scraper = new LLMScraper(llm);

		const categoryKeys = Object.keys(CategoryEnum).filter(key => key !== '') as [keyof typeof CategoryEnum, ...(keyof typeof CategoryEnum)[]];
		const rate_des_keys = Object.keys(rateDescription).filter(key => key !== 'n/a') as [keyof typeof rateDescription, ...(keyof typeof rateDescription)[]];
		// Define schema to extract contents into
		const schema = z.object({
			result:
				z.object({
					original_job_id: z.number(),
					title: z.string(),
					location: z.string().default('Los Angeles'),
					type: z.string(),
					body_type: z.optional(z.string()),
					gender: z.optional(z.string()),
					age: z.optional(z.string()),
					height: z.optional(z.string()),
					weight: z.optional(z.string()),
					ethnicity: z.optional(z.string()),
					union_job: z.boolean().default(false),
					rate: z.number().default(216),
					category: z.enum(categoryKeys).default('N/A'),
					compensation: z.enum(['Paid', 'Unpaid']).default('Unpaid'),
					date_posted: z.string().default(new Date().toISOString()),
					description: z.array(z.string()),
					rate_des: z.enum(rate_des_keys),
				})
					.describe('Detail all the information about the current listing. Do not wrap any text overflow in elipses or other symbols. If the location is not specified or is United States/Nation Wide, location=N/A. If you do not find any information use the default values.'),
		});

		logger.info('Running Scraper')
		const { data } = await scraper.run(page, schema, { format: 'html', maxTokens: 10000 }) as unknown as { data: ScrapedListing }
		logger.info("Scraper Result:\n" + JSON.stringify(data))
		const reply_email = await getJobReplayEmail(data.result.original_job_id)
		console.log(`reply_email: ${reply_email}`)
		console.log(JSON.stringify(data, null, 2))

		// const job = data.results[0]


		// const result = await getUpdatedNameAndDescription(listing.title, listing.job_description) as unknown as UpdatedNameDescriptionProjectQuality
		// const updatedJob = {
		//     ...job,
		//     title: result.name,
		//     updated_title: result.name,
		//     project_quality: result.project_quality,
		//     job_url: listing.job_url,
		//     updated_description: result.description,
		//     description: listing.job_description.join("\n")
		// }
		// await createCDLog(user.id, `Scraped listing ${JSON.stringify(updatedJob)}`)

		// const mappedJob = await mapJobToDatabase(updatedJob as Listing & { updated_title: string, updated_description: string }, user)
		// const response = await addProjectToET(mappedJob as MappedJob)


		// logger.info("Adding Roles to db.")
		// await addRoles(updatedJob.title, updatedJob.description, updatedJob.job_url)

		// logger.info("Adding Project Apps to db.")
		// await addProjectApps(updatedJob.title, updatedJob.job_url)
		// return response

	} catch (error) {
		logger.error('Error during scraping:', error)
		throw error
	} finally {
		if (page) await page.close()
		if (browser) await browser.close()
		logger.info("Browser Closed")
	}
} 