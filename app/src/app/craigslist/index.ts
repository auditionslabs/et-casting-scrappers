
// examples/scrape-talent-gigs.ts

import { CraigslistScraper } from "./craigslist-scraper.js";
import { ScrapingConfig } from "../../types/craigslist";

async function main() {
	const config: ScrapingConfig = {
		baseUrl: "https://losangeles.craigslist.org",
		category: "tlg", // talent/creative gigs
		maxPages: 5,
		delay: 2000, // 2 seconds between page loads
		headless: false, // Set to true for production
		maxRetries: 3,
		outputFormat: "json",	};

	const scraper = new CraigslistScraper(config);

	try {
		console.log("Starting Craigslist scraping...");
		console.log(`Target: ${config.baseUrl}/search/${config.category}`);
		console.log(`Max pages: ${config.maxPages}`);

		const result = await scraper.scrape();

		console.log("\n=== Scraping Results ===");
		console.log(`Total listings found: ${result.totalCount}`);
		console.log(`Pages scraped: ${result.pagesScraped}`);
		console.log(`Errors encountered: ${result.errors.length}`);

		if (result.errors.length > 0) {
			console.log("\nErrors:");
			result.errors.forEach((error, index) => {
				console.log(`${index + 1}. ${error}`);
			});
		}
		

		// if (result.listings.length > 0) {
		// 	console.log(result.listings.length)
		// 	console.log("\nSample listings:");
		// 	result.listings.forEach((listing, index) => {
		// 		console.log(`\n${index + 1}. ${listing.title}`);
		// 		console.log(`   Location: ${listing.location}`);
		// 		console.log(`   Price: ${listing.price || 'Not specified'}`);
		// 		console.log(`   Posted: ${listing.postingDate}`);
		// 		console.log(`   URL: ${listing.url}`);
		// 	});
		// }

	} catch (error) {
		console.error("Failed to complete scraping:", error);
	}
}

// // Handle script execution
// if (require.main === module) {
//   main().catch(console.error);
// }



main().catch(console.error);
