// types/craigslist.ts

export interface CraigslistListing {
    title: string;
    url: string;
    location: string;
    price?: string;
    postingDate: string;
    listingId: string;
}

export interface ScrapingConfig {
    baseUrl: string;
    category: string;
    maxPages?: number;
    delay?: number;
    headless?: boolean;
    maxRetries?: number;
    outputFormat?: 'json' | 'csv';
    outputFile?: string;
}

export interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    retryOnErrors?: string[];
}

export interface ScrapingResult {
    listings: CraigslistListing[];
    totalCount: number;
    pagesScraped: number;
    errors: string[];
    timestamp: string;
}