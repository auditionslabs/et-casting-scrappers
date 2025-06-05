import { chromium } from 'playwright'
import { z } from 'zod'
import LLMScraper from 'llm-scraper'
import logger from '../config/logger.js'
import { llm } from '../config/llm.js'
import { getFutureDate, parseDateToTimestamp, getCurrentTimestamp } from '../utils/dateUtils.js'
import { CDUser, rateDescription, snr_type, CategoryEnum, MappedJob } from '../types/casting.js'
import { searchCD } from '../helpers/searchCD.js'
import { generateObject } from 'ai'
import { getUpadtedNameAndDescription, type UpdatedNameDescriptionProjectQuality } from '../helpers/getUpdatedNameDescriptionProjectQuality.js'
import { searchDuplicateProject } from '../helpers/checkDuplicateProject.js'
import dotenv from 'dotenv'
import { createCDLog } from '../helpers/createCDLog.js'
import { addProjectToET } from '../helpers/addProjectToET.js'
import { addRoles } from '../helpers/addRoles.js'
import { addProjectApps } from '../helpers/addProjectApps.js'
import { db } from '../config/database.js'

dotenv.config()

interface ScraperResult {
    description: string[],
    original_name: string,
}



async function updateProjectQuality() {
    const browser = await chromium.launch()
    const page = await browser.newPage()
    const scraper = new LLMScraper(llm)
    let cnt = 0;
    try {
        const query = db.selectFrom('castings').select(['casting_id', 'address2', 'qlty_level']).where('asap', '>=', getCurrentTimestamp()).orderBy('casting_id', 'desc');
        const castings = await query.execute();
        const schema = z.object({
            description: z.array(z.string()),
            original_name: z.string(),
        }).describe(`All the information about the job. Do not wrap any text overflow in elipses or other symbols. If date posted is not provided, use today's date. The expiration date should be after the date posted. If expiration date is not provided, use 30 days from today's date. Return the unix timestamp for the expiration date. Rate the quality of the project on a scale of 4-6. 6 has the best actors, pays well. 4 has average actors, pays average. 5 is somewhere in between. If any information is not provided, use the default value. The job is Open Call if and only if Date of the audition is provided. Project name is the name of the movie/show/project.
            
        Today's date is: ${new Date().toISOString()}
        
        If an application email is found in the description, use it as the application email. If no application email is found, use not_found.`)
        for (const casting of castings) {
            cnt++;
            logger.info(`${cnt}: Updating project quality for ${JSON.stringify(casting)}`);
            if (casting.address2) {
                try {
                    await page.goto(casting.address2);
                    const { data } = (await scraper.run(page, schema, { format: 'html' })) as unknown as { data: ScraperResult };
                    console.log(data);
                    const updatedNameDescriptionProjectQuality = await getUpadtedNameAndDescription(data.original_name,data.description);
                    logger.info(`Updated name and description: ${JSON.stringify(updatedNameDescriptionProjectQuality)}`);
                    const updateQuery = db.updateTable('castings').set({
                        qlty_level: Math.round(updatedNameDescriptionProjectQuality.project_quality),

                        des: updatedNameDescriptionProjectQuality.description,
                    }).where('casting_id', '=', casting.casting_id);
                    await updateQuery.execute();
                    logger.info(`Updated project quality for ${casting.casting_id}`);
                } catch (error) {
                    logger.error('Error updating project quality:', error)
                }
            }
        }
    } catch (error) {
        logger.error('Error updating project quality:', error)
    }
}


await updateProjectQuality()
process.exit(0)