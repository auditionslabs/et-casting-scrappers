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

async function getAllProjectDocs (): Promise<oldOptimizedDoc[]> {
    let offset = 0;
    const limit = 1000;
    let allDocs: oldOptimizedDoc[] = [];
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
        allDocs = allDocs.concat(docs.results as oldOptimizedDoc[]);
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
    // console.log("res", res);
    // process.exit(0);
}

async function main() {
    const docs = await getAllProjectDocs();
    console.log(docs.length);
    for (const doc of docs) {
        const newDoc: OptimizedDoc = {
            ...doc,
            roles: doc.roles.map(role => ({
                ...role,
                age_range: {
                    min: role.age_range[0],
                    max: role.age_range[1]
                }
            }))
        }
        await updateProject(newDoc);
    }
    process.exit(0);
}
main();