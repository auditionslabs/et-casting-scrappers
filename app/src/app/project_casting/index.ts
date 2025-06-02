import { chromium } from 'playwright'
import { z } from 'zod'
import LLMScraper from 'llm-scraper'
import dotenv from 'dotenv'
import logger from '../../config/logger.js'
import { searchCD } from '../../helpers/searchCD.js'
import { searchDuplicateProject } from '../../helpers/checkDuplicateProject.js'
import { CDUser, ScrapedJob } from '../../types/casting.js'
import { scrapeListing } from './scrape_listings.js'
import { llm } from '../../config/llm.js'

type ScraperResult = {
	results: Array<{
		production_type: string;
		title: string;
		location: string;
		job_type: string;
		skills: string;
		company_name: string;
		job_url: string;
		date_posted: string;
		job_description: string[];
		union_job: boolean;
		compensation: 'Paid' | 'Unpaid';
	}>;
};

let isRunning = true
let browser: any = null

async function startScraper() {
	try {
		for (let i = 71; i <= 80; i++) {

			logger.info('Starting Project Casting Scraper')
			dotenv.config()

			browser = await chromium.launch()
			const page = await browser.newPage()
			logger.info('Opening Project Casting')

			await page.goto(`https://projectcasting.com/job?orderby=latest_posts&pg=${i}`)
			logger.info(`Project Casting Opened: ${i}`)

			// Create a new LLMScraper
			const scraper = new LLMScraper(llm)

			// Define schema to extract contents into
			const schema = z.object({
				results: z.array(
					z.object({
						title: z.string(),
						company_name: z.string(),
						job_url: z.string(),
						date_posted: z.string(),
						job_description: z.array(z.string()),
						union_job: z.boolean(),
						compensation: z.enum(['Paid', 'Unpaid']),
						rate: z.number() || 262,
						company_url: z.string(),
					}))

					.length(10)
					.describe('Top 10 jobs on Project Casting in detail with all the information about the job. Do not wrap any text overflow in elipses or other symbols.'),
			})

			logger.info('Running Scraper')


			const { data } = (await scraper.run(page, schema, { format: 'html', maxTokens: 20000 })) as unknown as { data: ScraperResult };

			// console.log(JSON.stringify(data, null, 2))
			logger.info("Scraper Result:\n" + JSON.stringify(data))

			// Show the result from LLM

			await page.close()
			logger.info("Adding Projects to Database")
			for (const job of data.results) {
				const user = await searchCD(job.company_name)
				const duplicate = await searchDuplicateProject(job.title, job.job_url)
				// console.log("duplicate:", duplicate)
				if (!duplicate) {
					try {
						const scrapedAndMappedJob = await scrapeListing(job as ScrapedJob, user as CDUser)
						// console.log(scrapedAndMappedJob)

						logger.info(`Added new project: ${scrapedAndMappedJob.name}`)
					} catch (error) {
						logger.error(`Error adding project ${job.title}:`, error)
					}
				} else {
					logger.info(`${job.title} not added. Project already exists in database`)
				}
			}
		}

	} catch (error) {
		logger.error('Error during scraping:', error)
		await cleanup()
	} finally {
		await cleanup()
	}

	process.exit(0);
}


async function cleanup() {
	if (browser) {
		await browser.close()
		logger.info("Browser Closed")
	}
	logger.info("Scraper Completed")
	
}

// Handle process termination
process.on('SIGINT', async () => {
	logger.info('Received SIGINT. Stopping gracefully...')
	isRunning = false
	await cleanup()
	process.exit(0)
})

process.on('SIGTERM', async () => {
	logger.info('Received SIGTERM. Stopping gracefully...')
	isRunning = false
	await cleanup()
	process.exit(0)
})

// Start the scraper
startScraper().catch(error => {
	logger.error('Fatal error:', error)
	process.exit(1)
})