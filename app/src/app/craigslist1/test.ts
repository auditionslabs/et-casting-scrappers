import { chromium } from 'playwright';
import { scrapeListing, type ScrapedJob } from './scrape_listings.js'

const listing = {"title":"THIS SATURDAY NIGHT - WE NEED EXTRAS FOR OUR MUSIC VIDEO (West Hollywood)","location":"West Hollywood","job_url":"https://losangeles.craigslist.org/lac/tlg/d/west-hollywood-this-saturday-night-we/7858514439.html"}

// const listing2 = {"title":"Women Needed For Entertainment Boxing Match","location":"Hollywood$300 for 4 minutes in the ring whether ...5/14pichide","job_url":"https://losangeles.craigslist.org/lac/tlg/d/los-angeles-women-needed-for/7850080274.html"}

await scrapeListing(listing)
process.exit(0)


// const url = "https://losangeles.craigslist.org/wst/tlg/d/los-angeles-indian-foodie-influencer/7850844213.html"
// const browser = await chromium.launch({headless: false});
// const context = await browser.newContext({userAgent:'VelenPublicWebCrawler'});
// const page = await context.newPage();
// await page.goto(url);



