// If you get a 'Cannot find module \"node-fetch\"' error, run: npm install node-fetch
import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CATEGORY_MAP } from './add_projects.js';
import dotenv from 'dotenv';
dotenv.config();

const MEILI_URL = process.env.MELISEARCH_BASE_URL;
const MEILI_KEY = process.env.MELISEARCH_MASTER_KEY;
const INDEX = 'projects';
const categoryKeys = Object.keys(CATEGORY_MAP).filter(key => key !== '') as [keyof typeof CATEGORY_MAP, ...(keyof typeof CATEGORY_MAP)[]];

async function getAllProjectDocs() {
    let offset = 0;
    const limit = 1000;
    let allDocs: any[] = [];
    while (true) {
        const res = await fetch(`${MEILI_URL}/indexes/${INDEX}/documents?limit=${limit}&offset=${offset}`, {
            headers: {
                'Authorization': `Bearer ${MEILI_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) throw new Error(`Failed to fetch docs: ${res.statusText}`);
        const docs = await res.json();
        allDocs = allDocs.concat(docs);
        if (docs.length < limit) break;
        offset += limit;
    }
    return allDocs;
}

async function getCategoryForCasting(casting_id: number): Promise<string> {
    const result = await db.selectFrom('castings')
        .select(['cat'])
        .where('casting_id', '=', casting_id)
        .executeTakeFirst();
    const cat = result?.cat;
    const categories = categoryKeys.filter(key => CATEGORY_MAP[key].includes(cat ?? -1)).join(',');
    return categories;
}

async function updateProjectCategoryInMeili(docId: string, categories: string[]) {
    const res = await fetch(`${MEILI_URL}/indexes/${INDEX}/documents`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${MEILI_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([{ id: docId, categories }])
    });
    if (!res.ok) throw new Error(`Failed to update doc ${docId}: ${res.statusText}`);
}

export default async function updateAllCategories() {
    logger.info('Fetching all project documents from Meilisearch...');
    const docs = await getAllProjectDocs();
    logger.info(`Found ${docs.length} documents.`);
    let updated = 0;
    for (const doc of docs) {
        try {
            const casting_id = doc.casting_id;
            const docId = doc.id;
            if (!casting_id || !docId) continue;
            const category = await getCategoryForCasting(casting_id);
            await updateProjectCategoryInMeili(docId, [category]);
            updated++;
            if (updated % 100 === 0) logger.info(`Updated ${updated} documents...`);
        } catch (err) {
            logger.error('Error updating document', err);
        }
    }
    logger.info(`Finished updating categories for ${updated} projects.`);
    process.exit(0);
}

updateAllCategories();