import { chromium } from 'playwright'
import { z } from 'zod'
import LLMScraper from 'llm-scraper'
import logger from '../../config/logger.js'
import { llm } from '../../config/llm.js'
import { getFutureDate,  } from '../../utils/dateUtils.js'
import { rate_des, snr_type } from '../../types/casting.js'
import { CategoryEnum } from '../../types/casting.js'

export async function scrapeListing(url: string) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const categoryKeys = Object.keys(CategoryEnum).filter(key => key !== '') as [keyof typeof CategoryEnum, ...(keyof typeof CategoryEnum)[]];
    const rate_des_keys = Object.keys(rate_des).filter(key => key !== 'n/a') as [keyof typeof rate_des, ...(keyof typeof rate_des)[]];
    const snr_type_keys = Object.keys(snr_type).filter(key => key !== 'n/a') as [keyof typeof snr_type, ...(keyof typeof snr_type)[]];

    const schema = z.object({
        name_original: z.string(),
        description: z.array(z.string()),
        location: z.string(),
        company: z.string(),
        date_posted: z.string() || new Date().toISOString(),
        application_url: z.string(),
        snr_type: z.enum(snr_type_keys),
        compensation: z.string() || 262,
        rate_des: z.enum(rate_des_keys),
        project_quality: z.number() || 0,
        category: z.enum(categoryKeys),
        expiration_date: z.string() || getFutureDate(new Date(), 30),
        union_job: z.boolean(),
        rate: z.number() || 262
    })
    .describe(`All the information about the job. Do not wrap any text overflow in elipses or other symbols. If expiration date is not provided, use 30 days from today's date. If date_posted is not provided, use today's date. Today's date is: ${new Date().toISOString()}
    
    `);

    const scraper = new LLMScraper(llm);

    const { data } = await scraper.run(page, schema, { format: 'html', maxTokens: 20000 });
    console.log(data);
    process.exit(0);
}
