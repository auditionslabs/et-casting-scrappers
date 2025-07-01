// scrapes all the listings from craigslist https://losangeles.craigslist.org/search/tlg?sort=date#search=2~list~0

import { chromium } from 'playwright'
import { z } from 'zod'
import LLMScraper from 'llm-scraper'
import dotenv from 'dotenv'
import logger from '../../config/logger.js'
import { searchCDByCompany } from '../../helpers/searchCD.js'
import { searchDuplicateProject } from '../../helpers/checkDuplicateProject.js'
import { CDUser, ScrapedJob } from '../../types/casting.js'
import { scrapeListing } from './scrape_listings'
import { llm } from '../../config/llm.js'

type ScraperResult = {
    results: Array<{
        name: string;
        location: string;
        job_url: string;
        compensation: 'Paid' | 'Unpaid';
    }>;
};

let isRunning = true
let browser: any = null

async function startScraper() {
    try {
        logger.info('Starting Craigslist Talent Gigs Scraper')
        dotenv.config()

        browser = await chromium.launch({ headless: false })
        const page = await browser.newPage()
        logger.info('Opening Craigslist')

        // First, get the total count of listings
        await page.goto('https://losangeles.craigslist.org/search/tlg?sort=date#search=2~list~0')
        logger.info('Craigslist Opened')

        // Wait for the visible-counts div
        await page.waitForSelector('.visible-counts', { timeout: 10000 })

        const totalCount = await page.evaluate(() => {
            const countsDiv = document.querySelector('.visible-counts')
            if (!countsDiv) return 0
            const totalText = countsDiv.textContent?.match(/of (\d+)/)?.[1]
            return totalText ? parseInt(totalText) : 0
        })

        logger.info(`Total listings available: ${totalCount}`)

        // Calculate how many pages we need to scrape
        const itemsPerPage = 200
        const totalPages = Math.ceil(totalCount / itemsPerPage)
        logger.info(`Will scrape ${totalPages} pages`)

        const seenUrls = new Set<string>()
        let currentOffset = 0
        let pageNum = 1

        while (pageNum <= totalPages) {
            const pageUrl = `https://losangeles.craigslist.org/search/tlg?sort=date#search=2~list~${currentOffset}`

            logger.info(`Scraping page ${pageNum} (offset: ${currentOffset})...`)
            await page.goto(pageUrl)
            await page.waitForSelector('.result-row, .cl-search-result', { timeout: 10000 })

            const results = await page.evaluate(() => {
                const listings = Array.from(document.querySelectorAll('.result-row, .cl-search-result'))
                return listings.map(listing => {
                    const titleEl = listing.querySelector('.posting-title')
                    const locationEl = listing.querySelector('.meta')
                    const linkEl = listing.querySelector('a.posting-title')
                    
                    return {
                        name: titleEl?.textContent?.trim() || '',
                        location: locationEl?.textContent?.trim() || '',
                        job_url: linkEl?.getAttribute('href') || '',                    }
                })
            })

            logger.info(`Found ${results.length} listings on page ${pageNum}`)
            logger.info(`Results on page ${pageNum}: ${JSON.stringify(results)}`)

            // Process each listing
            // for (const job of results) {
            //     if (seenUrls.has(job.job_url)) {
            //         logger.info('Duplicate listing found. Stopping pagination.')
            //         return
            //     }
            //     seenUrls.add(job.job_url)

            //     // const user = await searchCDByCompany()
            //     const duplicate = await searchDuplicateProject(job.name, job.job_url)
            //     let user = {
            //         id: 1,
            //         email: "booking@exploretalent.com",
            //     } as CDUser

            //     if (!duplicate) {
            //         try {
            //             const scrapedAndMappedJob = await scrapeListing(job as ScrapedJob, user)
            //             logger.info(`Added new project: ${scrapedAndMappedJob.name}`)
            //         } catch (error) {
            //             logger.error(`Error adding project ${job.title}:`, error)
            //         }
            //     } else {
            //         logger.info(`${job.title} not added. Project already exists in database`)
            //     }
            // }

            currentOffset += results.length
            pageNum++
            await page.waitForTimeout(2000) // 2 second delay between pages
        }

    } catch (error) {
        logger.error('Error during scraping:', error)
        await cleanup()
    } finally {
        await cleanup()
    }

    process.exit(0)
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
