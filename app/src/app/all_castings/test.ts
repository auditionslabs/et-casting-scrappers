import { scrapeListing } from "./scrape_listings.js";
import { chromium } from "playwright";
const browser = await chromium.launch();
const ex1 = {
    "name": "'Squid Game: The Challenge' In Need Of Contestants",
    "location": "United States",
    "category": "Reality TV",
    "url": "/castingcall/289689" 
  }

await scrapeListing(ex1)
process.exit(0);