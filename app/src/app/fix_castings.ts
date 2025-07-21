import dotenv from 'dotenv';
dotenv.config();

import { db } from '../config/database.js';
import { llm } from '../config/llm.js';
import { getCurrentTimestamp, getFutureDate } from '../utils/dateUtils.js';
import { Castings } from '../models/admin/Castings.js';
import { z } from 'zod';
import LLMScraper from 'llm-scraper'
import logger from '../config/logger.js'
import { chromium, Browser } from 'playwright'
import { CategoryEnum, rateDescription, snr_type } from '../types/casting.js';
import { addRoles } from '../helpers/addRoles.js';

const categoryKeys = Object.keys(CategoryEnum).filter(key => key !== '') as [keyof typeof CategoryEnum, ...(keyof typeof CategoryEnum)[]];
const rate_des_keys = Object.keys(rateDescription).filter(key => key !== 'n/a') as [keyof typeof rateDescription, ...(keyof typeof rateDescription)[]];
const snr_type_keys = Object.keys(snr_type).filter(key => key !== 'n/a') as [keyof typeof snr_type, ...(keyof typeof snr_type)[]];


async function fixCastings() {
    const castings = await db.selectFrom('castings')
        .selectAll()
        .where('asap', '>=', getCurrentTimestamp())
        .where('status', '=', 1)
        .where('address2','<>', '')
        .orderBy('asap', 'desc')
        .limit(10000)
        .offset(5)
        .execute();
    
    logger.info(`Found ${castings.length} castings to fix.`);
    for (const casting of castings) {
        logger.info("Casting: ", casting.casting_id);
        const URL = casting.address2;    
        await db.deleteFrom('roles').where('casting_id', '=', casting.casting_id).execute();
        if (URL) {
            await addRoles(casting.name || '', casting.des || '', URL || '');    
            // process.exit(0);
        }
        await db.updateTable('castings')
            .set({last_modified: getCurrentTimestamp()})
            .where('casting_id', '=', casting.casting_id)
            .execute();  
    }
}

await fixCastings();
process.exit(0);