import { CATEGORY_MAP, convertRole, OptimizedDoc } from './helper.js';
import { getRoles } from '../export_to_csv/helper.js';
import logger from '../../config/logger.js';
import dotenv from 'dotenv';
dotenv.config();

logger.info('[START] add_forgotten_fields script');

const MEILI_URL = 'http://23.239.106.139:7700';
const MEILI_KEY = 'uqgNSaNNO8lJD9Uz2EpEHUM2sRteso5j4wH2qQD1M';
const INDEX = 'projects';
const categoryKeys = Object.keys(CATEGORY_MAP).filter(key => key !== '') as [keyof typeof CATEGORY_MAP, ...(keyof typeof CATEGORY_MAP)[]];

async function getAllProjectDocs (): Promise<OptimizedDoc[]> {
    logger.info('[INFO] Fetching all project docs from Meilisearch...');
    let offset = 0;
    const limit = 1000;
    let allDocs: OptimizedDoc[] = [];
    while (true) {
        logger.info(`[INFO] Fetching docs with offset ${offset}, limit ${limit}`);
        const res = await fetch(`${MEILI_URL}/indexes/${INDEX}/documents?limit=${limit}&offset=${offset}`, {
            headers: {
                'Authorization': `Bearer ${MEILI_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
            logger.error(`[ERROR] Failed to fetch docs: ${res.statusText}`);
            throw new Error(`Failed to fetch docs: ${res.statusText}`);
        }
        const docs = await res.json();
        logger.info(`[INFO] Fetched ${docs.results.length} docs`);
        allDocs = allDocs.concat(docs.results as OptimizedDoc[]);
        if (docs.results.length < limit) break;
        offset += limit;
    }
    logger.info(`[INFO] Total docs fetched: ${allDocs.length}`);
    return allDocs;
}

async function updateProject(doc: OptimizedDoc) {
    logger.info(`[INFO] Updating project in Meilisearch for casting_id ${doc.casting_id}`);
    const res = await fetch(`${MEILI_URL}/indexes/${INDEX}/documents`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${MEILI_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doc)
    });
    if (!res.ok) {
        logger.error(`[ERROR] Failed to update doc ${doc.casting_id}: ${res.statusText}`);
        throw new Error(`Failed to update doc: ${res.statusText}`);
    }
    logger.info(`[SUCCESS] Updated doc for casting_id ${doc.casting_id}`);
}

async function updateRoles(casting_id: number) {
    logger.info(`[INFO] Fetching roles for casting_id ${casting_id}`);
    const roles = await getRoles(casting_id);
    const roles_with_fields = roles.map(role => convertRole(role));
    logger.info(`[INFO] Got ${roles_with_fields.length} roles for casting_id ${casting_id}`);
    return roles_with_fields;
}

async function updateAllProjects() {
    try {
        logger.info('[INFO] Starting main function');
        const docs = await getAllProjectDocs();
        logger.info(`[INFO] Number of docs to update: ${docs.length}`);
        let processed = 0;
        for (const doc of docs) {
            try {
                logger.info(`[INFO] Processing casting_id ${doc.casting_id}`);
                doc.roles = await updateRoles(doc.casting_id);
                await updateProject(doc);
                processed++;
                logger.info(`[INFO] Processed ${processed}/${docs.length}`);
            } catch (err) {
                logger.error(`[ERROR] Error updating casting_id ${doc.casting_id}:`, err);
            }
        }
        logger.info(`[COMPLETE] All docs processed. Total: ${processed}`);
        process.exit(0);
    } catch (err) {
        logger.error('[FATAL] Error in main:', err);
        process.exit(1);
    }
}

await updateAllProjects();