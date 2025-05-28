import { chromium } from 'playwright'
import { z } from 'zod'
import { google } from '@ai-sdk/google'
// import { openai } from '@ai-sdk/openai'
import LLMScraper from 'llm-scraper'
import dotenv from 'dotenv'
import logger from '../config/logger.js'
import { searchCD } from '../helpers/searchCD.js'
import { searchDuplicateProject } from '../helpers/checkDuplicateProject.js'

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
		compensation: 'Paid' | 'Unpaid' | 'Credit' | 'Unknown';
	}>;
};

let isRunning = true
let browser: any = null

async function startScraper() {
	try {
		logger.info('Starting Project Casting Scraper')
		dotenv.config()

		browser = await chromium.launch()
		const page = await browser.newPage()
		logger.info('Opening Project Casting')
		await page.goto('https://projectcasting.com/job?orderby=latest_posts')
		logger.info('Project Casting Opened')

		// Initialize LLM provider
		const llm = google('gemini-2.0-flash')
		// const llm = google('gpt-4o')

		// Create a new LLMScraper
		const scraper = new LLMScraper(llm)

		// Define schema to extract contents into
		const schema = z.object({
			results: z.array(
				z.object({
					production_type: z.string(),
					title: z.string(),
					location: z.string(),
					job_type: z.string(),
					skills: z.string(),
					company_name: z.string(),
					job_url: z.string(),
					date_posted: z.string(),
					job_description: z.array(z.string()),
					union_job: z.boolean(),
					compensation: z.enum(['Paid', 'Unpaid', 'Credit', 'Unknown']),
				}))

				.length(5)
				.describe('Top 5 jobs on Project Casting in detail with all the information about the job. Do not wrap any text overflow in elipses or other symbols.'),
		})

		logger.info('Running Scraper')


		const { data } = (await scraper.run(page,schema, { format: 'html' })) as unknown as { data: ScraperResult };

		// console.log(JSON.stringify(data, null, 2))
		logger.info("Scraper Result:\n" + JSON.stringify(data))

		// Show the result from LLM
		// console.log(JSON.stringify(data, null, 2))

		await page.close()
		logger.info("Adding Projects to Database")

		for (const job of data.results) {
			console.log(JSON.stringify(job, null, 2))
			const user = await searchCD(job.company_name)
			const duplicate = await searchDuplicateProject(job.title)

			if (duplicate) {
				logger.info(job.company_name, user)
			} else {
				logger.info("Project already exists in database")
			}
		}
		// while (isRunning) {
		// 	if (!isRunning) break
			
		// 	// Add delay between iterations if needed
		// 	await new Promise(resolve => setTimeout(resolve, 5000))
		// }

	} catch (error) {
		logger.error('Error during scraping:', error)
	} finally {
		await cleanup()
	}
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