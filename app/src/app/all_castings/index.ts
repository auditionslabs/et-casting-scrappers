import { chromium } from 'playwright'
import { z } from 'zod'
import LLMScraper from 'llm-scraper'
import dotenv from 'dotenv'
import logger from '../../config/logger.js'
import { searchDuplicateProject } from '../../helpers/checkDuplicateProject.js'
import { scrapeListing } from './scrape_listings.js'
import { llm } from '../../config/llm.js'

const baseUrl = 'https://allcasting.com/castingcalls?page='
const listingBaseUrl = 'https://allcasting.com'
const browser = await chromium.launch()
let isRunning = true

export type ScraperResult = {
        name: string;
        location: string;
        category: string;
        url: string;
};

async function startScraper() {
    const page = await browser.newPage()

    try {
        for (let i = 1; i <= 1; i++) {
            await page.goto(`${baseUrl}${i}`)
            logger.info(`Page ${i} loaded`)

            const scraper = new LLMScraper(llm)
            const schema = z.object({
                results: z.array(z.object({
                    name: z.string().describe("The name of the casting call"),
                    location: z.string().describe("The location of the casting call"),
                    category: z.string().describe("The category of the casting call"),
                    url: z.string().describe("The url of the casting call"),
                })),
            }).describe("Find all the information about each casting call on the page. Do not wrap any text overflow in elipses or other symbols.");

            const { data } = (await scraper.run(page, schema, { format: 'html', maxTokens: 20000 })) as unknown as { data: { results: Array<ScraperResult> } };
            logger.info(`Scraper results: ${JSON.stringify(data)}`)
            for (const listing of data.results) {
                const duplicate = await searchDuplicateProject(listing.name, listingBaseUrl + listing.url)
                if (!duplicate) {
                    await scrapeListing(listing, browser);
                    // process.exit(0);

                }
                else {
                    logger.info(`Project already exists: ${listing.name}`);
                }
            }
            await page.close()

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







