import { chromium } from 'playwright'
import { z } from 'zod'
import LLMScraper from 'llm-scraper'
import dotenv from 'dotenv'
import logger from '../../config/logger.js'
import { searchDuplicateProject } from '../../helpers/checkDuplicateProject.js'
import { llm } from '../../config/llm.js'
import { scrapeListing } from './scrape_listing.js'

const BASE_URL = "https://www.auditionsfree.com/page/"

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
		for (let i = 4; i <= 6; i++) {

			logger.info('Starting Auditions Free Scraper')
			dotenv.config()

			browser = await chromium.launch()
			const page = await browser.newPage()
			// logger.info('Opening Auditions Free')

			await page.goto(`${BASE_URL}${i}/`)
			// logger.info(`Auditions Free Opened: ${i}`)

            // await page.waitForSelector(".site-content")

			// Create a new LLMScraper
			const scraper = new LLMScraper(llm)

			// Define schema to extract contents into
			const schema = z.object({
				results: z.array(
					z.object({
						title: z.string(),
						job_url: z.string(),
                        category: z.string(),
					}))

					.describe('All jobs on Auditions Free in detail with all the information about the job. Do not wrap any text overflow in elipses or other symbols.'),
			})

			logger.info('Running Scraper')


			const { data } = (await scraper.run(page, schema, { format: 'html', maxTokens: 20000 })) as unknown as { data: ScraperResult };

			logger.info("Scraper Result:\n" + JSON.stringify(data))

			// Show the result from LLM

			await page.close()
            await browser.close()
			// logger.info("Adding Projects to Database")

            for (const job of data.results) {
                const duplicate = await searchDuplicateProject(job.title, job.job_url)
                if (!duplicate) {
                    await scrapeListing(job.job_url)
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