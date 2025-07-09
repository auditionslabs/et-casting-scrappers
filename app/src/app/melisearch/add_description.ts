// If you get a 'Cannot find module \"node-fetch\"' error, run: npm install node-fetch
import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CATEGORY_MAP, OptimizedDoc, oldOptimizedDoc } from './add_projects.js';
import dotenv from 'dotenv';
dotenv.config();

const MEILI_URL = 'http://23.239.106.139:7700';
const MEILI_KEY = 'uqgNSaNNO8lJD9Uz2EpEHUM2sRteso5j4wH2qQD1M';
const INDEX = 'projects';
const categoryKeys = Object.keys(CATEGORY_MAP).filter(key => key !== '') as [keyof typeof CATEGORY_MAP, ...(keyof typeof CATEGORY_MAP)[]];

async function getAllProjectDocs (): Promise<OptimizedDoc[]> {
    let offset = 0;
    const limit = 1000;
    let allDocs: OptimizedDoc[] = [];
    while (true) {
        const res = await fetch(`${MEILI_URL}/indexes/${INDEX}/documents?limit=${limit}&offset=${offset}`, {
            headers: {
                'Authorization': `Bearer ${MEILI_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
            // console.log(res);
            throw new Error(`Failed to fetch docs: ${res.statusText}`);
        }
        const docs = await res.json();
        // console.log("docs", docs);
        allDocs = allDocs.concat(docs.results as OptimizedDoc[]);
        // console.log("allDocs", allDocs);
        if (docs.results.length < limit) break;
        offset += limit;
    }
    return allDocs;
}

async function updateProject(doc: OptimizedDoc) {
    console.log("doc", doc);
    // process.exit(0);
    const res = await fetch(`${MEILI_URL}/indexes/${INDEX}/documents`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${MEILI_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doc)
    });
    console.log("res", res);
    process.exit(0);
}

async function main() {
    const docs = await getAllProjectDocs();
    console.log(docs.length);
    for (const doc of docs) {
        const db_doc = await db.selectFrom('castings')
            .select(['des'])
            .where('casting_id', '=', doc.casting_id)
            .executeTakeFirst();
        doc.description = db_doc?.des ?? '';
        // console.log("doc", doc);
        // process.exit(0);
        await updateProject(doc);
    }
    process.exit(0);
}

main();