// If you get a 'Cannot find module \"node-fetch\"' error, run: npm install node-fetch
import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CATEGORY_MAP, OptimizedDoc } from './add_projects.js';
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

// async function getDescriptionForRole(role: OptimizedRole): Promise<OptimizedRole> {
//     const result = await db.selectFrom('roles')
//         .select(['des'])
//         .where('role_id', '=', role.role_id)
//         .executeTakeFirst();
//     return {
//         ...role,
//         description: result?.des ?? ''
//     };
// }

function toUnixEpoch(dateStr: string | number | null): number | null {
    const t = new Date(dateStr ?? '').getTime();
    return isNaN(t) ? null : Math.floor(t / 1000);
}

async function updateProject(doc: OptimizedDoc) {
    // const roles = await Promise.all(doc.roles.map(role => getDescriptionForRole(role)));
    // doc.roles = roles;
    // console.log("doc", doc);
    const res = await fetch(`${MEILI_URL}/indexes/${INDEX}/documents`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${MEILI_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doc)
    });
}

async function main() {
    const docs = await getAllProjectDocs();
    console.log(docs.length);
    for (const doc of docs) {
        const db_doc = await db.selectFrom('castings')
            .selectAll()
            .where('casting_id', '=', doc.casting_id)
            .executeTakeFirst();
        if (db_doc?.asap) {
            doc.dates.asap = db_doc.asap;
            doc.dates.submission = db_doc.sub_timestamp;
            doc.dates.created = db_doc.date_created;
            doc.dates.last_modified = db_doc.last_modified;
            for( const role of doc.roles) { 
                const db_role = await db.selectFrom('roles')
                    .selectAll()
                    .where('role_id', '=', role.role_id)
                    .executeTakeFirst();
                role.shoot_date = db_role?.shoot_timestamp ?? null;
                role.expiration_date = db_role?.expiration_timestamp ?? null;
                role.last_modified = db_role?.last_modified ?? null;
            }
        }
        await updateProject(doc);
    }
    process.exit(0);
}

main();