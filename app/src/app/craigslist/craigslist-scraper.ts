// src/craigslist-scraper.ts

import { chromium, Browser, Page, BrowserContext } from "playwright";
import { CraigslistListing, ScrapingConfig, ScrapingResult, RetryConfig } from "../../types/craigslist";
import * as fs from "fs";
import * as path from "path";

export class CraigslistScraper {
  private config: ScrapingConfig;
  private retryConfig: RetryConfig;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private result: ScrapingResult;

  constructor(config: ScrapingConfig) {
    this.config = {
      ...config,
      maxPages: config.maxPages || 1,
      delay: config.delay || 1000,
      headless: config.headless !== false,
      maxRetries: config.maxRetries || 3,
      outputFormat: config.outputFormat || "json",
      outputFile: config.outputFile || `${path.join(process.cwd(), 'data')}/craigslist_${config.category}_${new Date().toISOString().split("T")[0]}.json`
    };

    this.retryConfig = {
      maxRetries: this.config.maxRetries || 3,
      baseDelay: 1000,
      maxDelay: 10000,
      retryOnErrors: [
        "net::ERR_CONNECTION_RESET",
        "net::ERR_CONNECTION_CLOSED",
        "net::ERR_FAILED",
        "Navigation timeout"
      ]
    };

    this.result = {
      listings: [],
      totalCount: 0,
      pagesScraped: 0,
      errors: [],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Initialize browser and create a new context
   */
  public async initialize(): Promise<void> {
    try {
      console.log("Initializing browser...");
      this.browser = await chromium.launch({
        headless: this.config.headless,
        args: [
          "--disable-blink-features=AutomationControlled",
          "--disable-web-security",
          "--disable-features=IsolateOrigins,site-per-process"
        ]
      });

      // Create a context with realistic viewport and user agent
      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 800 },
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        javaScriptEnabled: true,
        ignoreHTTPSErrors: true
      });

      // Modify browser fingerprints to avoid detection
      await this.modifyFingerprint();

      this.page = await this.context.newPage();

      // Add event listeners for errors
      this.page.on("console", (msg) => {
        if (msg.type() === "error") {
          console.error(`Page console error: ${msg.text()}`);
        }
      });

      this.page.on("pageerror", (err) => {
        console.error(`Page error: ${err.message}`);
        this.result.errors.push(`Page error: ${err.message}`);
      });

      console.log("Browser initialized successfully");
    } catch (error) {
      console.error("Failed to initialize browser:", error);
      throw error;
    }
  }

  /**
   * Modify browser fingerprints to avoid detection
   */
  private async modifyFingerprint(): Promise<void> {
    if (!this.page) return;

    await this.page.addInitScript(() => {
      // Overwrite the navigator properties to appear more like a regular browser
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      Object.defineProperty(navigator, "plugins", { 
        get: () => [
          { name: "Chrome PDF Plugin", filename: "internal-pdf-viewer" },
          { name: "Chrome PDF Viewer", filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai" },
          { name: "Native Client", filename: "internal-nacl-plugin" },
        ] 
      });

      // Override platform
      Object.defineProperty(navigator, "platform", { get: () => "Win32" });

      // Override hardware concurrency
      Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });

      // Override device memory
      // @ts-ignore - Property 'deviceMemory' does not exist on type 'Navigator'
      Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });

      // Modify language
      Object.defineProperty(navigator, "language", { get: () => "en-US" });
      Object.defineProperty(navigator, "languages", { get: () => ["en-US", "en"] });

      // Remove automation-specific attributes
      delete (window as any).cdc_adoQpoasnfa76pfcZLmcfl_;
    });
  }

  /**
   * Navigate to the Craigslist page with natural delays and interactions
   */
  private async navigateToPage(url: string): Promise<void> {
    if (!this.page) throw new Error("Browser not initialized");

    try {
      console.log(`Navigating to ${url}`);
      await this.retryOperation(async () => {
        await this.page!.goto(url, { waitUntil: "domcontentloaded" });
        await this.simulateHumanBehavior();
      });
    } catch (error) {
      console.error(`Failed to navigate to ${url}:`, error);
      this.result.errors.push(`Navigation error: ${error}`);
      throw error;
    }
  }

  /**
   * Simulate human-like behavior to avoid detection
   */
  private async simulateHumanBehavior(): Promise<void> {
    if (!this.page) return;

    // Random delay between 500ms and 2000ms
    const randomDelay = Math.floor(Math.random() * 1500) + 500;
    await this.page.waitForTimeout(randomDelay);

    // Random scroll behavior
    await this.page.evaluate(() => {
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const scrollStep = Math.floor(Math.random() * 100) + 50;
      let currentPosition = 0;

      const scrollInterval = setInterval(() => {
        window.scrollBy(0, scrollStep);
        currentPosition += scrollStep;

        if (currentPosition >= scrollHeight * 0.6) {
          clearInterval(scrollInterval);
        }
      }, Math.floor(Math.random() * 40) + 10);
    });

    // Wait for random time after scrolling
    await this.page.waitForTimeout(Math.floor(Math.random() * 1000) + 500);
  }

  /**
   * Extract listings from the current page
   */
  private async extractListings(): Promise<CraigslistListing[]> {
    if (!this.page) throw new Error("Browser not initialized");

    try {
      // Wait for the listings to be visible on the page
      await this.page.waitForSelector('div[title]', { timeout: 10000 });

      // Extract all listings using page.evaluate()
      const listings = await this.page.evaluate(() => {
        const listingElements = Array.from(document.querySelectorAll('div[title]'));

        return listingElements.map(element => {
          const titleElement = element.getAttribute('title') || '';
          const anchorElement = element.querySelector('a');
          const url = anchorElement ? anchorElement.href : '';

          // Get the nested div that contains location, price, and date
          const infoDiv = element.querySelector('div div');

          // Parse location, price, and date
          let location = '';
          let price = '';
          let postingDate = '';

          if (infoDiv) {
            const text = infoDiv.textContent || '';

            // Location is typically at the beginning
            const locationMatch = text.match(/^([^$\d]+)/);
            location = locationMatch ? locationMatch[1].trim() : '';

            // Price often starts with $
            const priceMatch = text.match(/\$(\d+)/);
            price = priceMatch ? `$${priceMatch[1]}` : '';

            // Date is often at the end
            const dateMatch = text.match(/(\d+h ago|\d+m ago|\d+d ago|\d+\/\d+)/);
            postingDate = dateMatch ? dateMatch[1] : '';
          }

          // Extract listing ID from URL
          const idMatch = url.match(/\/([a-zA-Z0-9]+)\.html/);
          const listingId = idMatch ? idMatch[1] : '';

          return {
            title: titleElement,
            url,
            location,
            price,
            postingDate,
            listingId
          };
        });
      });

      return listings as CraigslistListing[];
    } catch (error) {
      console.error("Failed to extract listings:", error);
      this.result.errors.push(`Extraction error: ${error}`);
      return [];
    }
  }

  /**
   * Get the URL for the next page of results
   */
  private async getNextPageUrl(): Promise<string | null> {
    if (!this.page) throw new Error("Browser not initialized");

    try {
      // Try multiple possible selectors for the next page button
      const selectors = [
        'a.button.next',
        'a[title="next page"]',
        'a[rel="next"]',
        'a.next',
        'a[class*="next"]'
      ];

      for (const selector of selectors) {
        const nextButton = await this.page.$(selector);
        if (nextButton) {
          const href = await nextButton.getAttribute('href');
          if (href) {
            console.log(`Found next page link with selector: ${selector}`);
            return href.startsWith('http') 
              ? href 
              : `${this.config.baseUrl}${href}`;
          }
        }
      }

      // If no next button found, check if we're on the last page
      const currentPage = await this.page.$('.currentpage');
      if (currentPage) {
        const pageText = await currentPage.textContent();
        console.log(`Current page indicator: ${pageText}`);
      }

      console.log('No next page button found - might be on last page');
      return null;
    } catch (error) {
      console.error("Failed to get next page URL:", error);
      this.result.errors.push(`Next page error: ${error}`);
      return null;
    }
  }

  /**
   * Utility function to retry operations with exponential backoff
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    customConfig?: Partial<RetryConfig>
  ): Promise<T> {
    const config = { ...this.retryConfig, ...customConfig };
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;

        // Check if we should retry based on error message
        const shouldRetry = !config.retryOnErrors || 
          config.retryOnErrors.some((errMsg: string) => 
            error.message.includes(errMsg)
          );

        if (!shouldRetry || attempt === config.maxRetries) {
          throw error;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.baseDelay * Math.pow(1.5, attempt - 1),
          config.maxDelay
        );

        console.log(`Retry attempt ${attempt}/${config.maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error("Max retries exceeded");
  }

  /**
   * Save scraped data to file
   */
  private async saveResults(): Promise<void> {
    const outputDir = path.dirname(this.config.outputFile!);

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (this.config.outputFormat === 'json') {
      fs.writeFileSync(
        this.config.outputFile!,
        JSON.stringify(this.result, null, 2)
      );
    } else if (this.config.outputFormat === 'csv') {
      // Convert to CSV
      const headers = "title,url,location,price,postingDate,listingId\n";
      const rows = this.result.listings.map((listing: {
        title: string,
        url: string,
        location: string,
        price?: string,
        postingDate: string,
        listingId: string
      }) => 
        `"${listing.title.replace(/"/g, '""')}","${listing.url}","${listing.location.replace(/"/g, '""')}","${listing.price || ''}","${listing.postingDate}","${listing.listingId}"`
      ).join('\n');

      fs.writeFileSync(this.config.outputFile!, headers + rows);
    }

    console.log(`Results saved to ${this.config.outputFile}`);
  }

  /**
   * Close browser and clean up resources
   */
  public async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
      console.log("Browser closed");
    }
  }

  /**
   * Main method to scrape Craigslist listings
   */
  public async scrape(): Promise<ScrapingResult> {
    try {
      // Initialize browser if not already initialized
      if (!this.browser) {
        await this.initialize();
      }

      // Construct the initial URL
      const baseUrl = `${this.config.baseUrl}/search/${this.config.category}?sort=date#search=2~list`;
      let currentOffset = 0;
      let pageNum = 1;
      let hasMoreResults = true;
      const seenUrls = new Set<string>();

      // First, get the total count of listings
      await this.navigateToPage(baseUrl);
      await this.page!.waitForSelector('.visible-counts', { timeout: 10000 });
      
      const totalCount = await this.page!.evaluate(() => {
        const countsDiv = document.querySelector('.visible-counts');
        if (!countsDiv) return 0;
        const totalText = countsDiv.textContent?.match(/of (\d+)/)?.[1];
        return totalText ? parseInt(totalText) : 0;
      });

      console.log(`Total listings available: ${totalCount}`);

      // Calculate how many pages we need to scrape
      const itemsPerPage = 120;
      const totalPages = Math.ceil(totalCount / itemsPerPage);
      console.log(`Will scrape ${totalPages} pages`);

      while (hasMoreResults && pageNum <= totalPages) {
        // Construct URL with pagination parameter
        const pageUrl = currentOffset === 0 
          ? baseUrl 
          : `${baseUrl}~${currentOffset}`;
        
        console.log(`Scraping page ${pageNum} (offset: ${currentOffset})...`);
        
        // Navigate to the page
        await this.navigateToPage(pageUrl);

        // Wait for listings to load
        await this.page!.waitForSelector('.result-row, .cl-search-result', { 
          timeout: 10000,
          state: 'attached'
        });

        // Extract listings
        const pageListings = await this.extractListings();
        
        // Check each listing before adding
        for (const listing of pageListings) {
          if (seenUrls.has(listing.url)) {
            console.log('Duplicate listing found. Stopping pagination.');
            hasMoreResults = false;
            break;
          }
          seenUrls.add(listing.url);
          this.result.listings.push(listing);
        }

        if (!hasMoreResults) break;

        console.log(`Found ${pageListings.length} listings on page ${pageNum}`);
        console.log(`Total unique listings collected: ${seenUrls.size}`);

        // Increment for next page
        currentOffset += pageListings.length; // Craigslist uses 120 items per page
        pageNum++;

        // Add delay between pages
        await this.page!.waitForTimeout(this.config.delay!);
      }

      // Update result metadata
      this.result.pagesScraped = pageNum - 1;
      this.result.totalCount = this.result.listings.length;

      // Save results to file
      await this.saveResults();

      return this.result;
    } catch (error) {
      console.error("Error during scraping:", error);
      this.result.errors.push(`Scraping error: ${error}`);
      return this.result;
    } finally {
      // Always close the browser
      await this.close();
    }
  }
}
