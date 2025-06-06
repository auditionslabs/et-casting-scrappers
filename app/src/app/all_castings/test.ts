import { scrapeListing } from "./scrape_listings.js";
import { chromium } from "playwright";
const browser = await chromium.launch();
const ex1 = {
    "name": "Mens Swimwear Photo Shoot",
    "location": "Ocean Isle Beach, NC, United States",
    "category": "Modeling",
    "url": "/castingcall/286608"
  }

await scrapeListing(ex1, browser)
process.exit(0);