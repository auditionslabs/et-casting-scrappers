import { db } from '../../config/database.js'

import { getRoles } from '../../app/export_to_csv/helper.js';
import { addPorjectToMelisearch } from '../../config/melisearch.js';
import logger from '../../config/logger.js';
import { checkIfCastingInMelisearch, convertDocument } from './helper.js';
import dotenv from 'dotenv';
dotenv.config();

const MEILI_URL = process.env.MELISEARCH_BASE_URL || 'http://23.239.106.139:7700';
const MEILI_KEY = process.env.MELISEARCH_MASTER_KEY || 'uqgNSaNNO8lJD9Uz2EpEHUM2sRteso5j4wH2qQD1M';
const INDEX = 'projects';


export default async function addProjectsToMelisearch() {
    // Calculate timestamp for 7 days ago
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const tenMinutesAgoTimestamp = Math.floor(tenMinutesAgo.getTime() / 1000);

    // Fetch only recently updated castings
    const query = db.selectFrom('castings')
        .selectAll()
        .where((eb) => eb.and([
            eb.or([
                eb('asap', '>=', new Date().getTime()),
                eb('last_modified', '>=', tenMinutesAgoTimestamp)
            ]),
            eb('status', '=', 1)
        ]))
        .orderBy('last_modified', 'desc');

    const castings = await query.execute();

    logger.info(`${castings.length} castings updated in the last 10 minutes to add to melisearch`);
    if (castings.length === 0) {
        logger.info('No castings to add to melisearch');
        process.exit(0);
    }

    const BATCH_SIZE = 20;
    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < castings.length; i += BATCH_SIZE) {
        const batch = castings.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(castings.length / BATCH_SIZE);

        logger.info(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)`);

        for (const casting of batch) {
            // Skip if already in Meilisearch
            if (await checkIfCastingInMelisearch(casting.casting_id)) {
                if (tenMinutesAgoTimestamp <= (casting.last_modified ?? 0)) {
                    logger.info(`Updating casting_id ${casting.casting_id} (last_modified is less than one hour ago)`);
                    const updatedDoc = await convertDocument(
                        {
                            ...casting,
                            roles: await getRoles(casting.casting_id)
                        }
                    );
                    const result = await addPorjectToMelisearch(updatedDoc, INDEX);
                    successCount++;
                    logger.info(`Successfully updated casting_id ${casting.casting_id} in melisearch`);
                }
                else{

                    logger.info(`Skipping casting_id ${casting.casting_id} (already in Meilisearch)`);
                    continue;
                }    
                
            }
            try {
                const optimizedDoc = await convertDocument(
                    {
                        ...casting,
                        roles: await getRoles(casting.casting_id)
                    }
                );

                const result = await addPorjectToMelisearch(optimizedDoc, INDEX);
                successCount++;
                logger.info(`Successfully added casting_id ${casting.casting_id} to melisearch`);

            } catch (error) {
                errorCount++;
                logger.error(`Error adding casting_id ${casting.casting_id} to melisearch`, error);
            }
            processedCount++;
        }

        logger.info(`Batch ${batchNumber}/${totalBatches} completed. Processed: ${processedCount}/${castings.length}, Success: ${successCount}, Errors: ${errorCount}`);

        // Sleep for 1 second between batches (except for the last batch)
        if (i + BATCH_SIZE < castings.length) {
            logger.info('Sleeping for 1 second before next batch...');
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    logger.info(`All batches completed. Total processed: ${processedCount}, Success: ${successCount}, Errors: ${errorCount}`);
    process.exit(0);
}

await addProjectsToMelisearch();