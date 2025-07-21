import dotenv from 'dotenv';
dotenv.config();

import { z } from 'zod';

const MEILI_URL = process.env.MELISEARCH_BASE_URL || 'http://23.239.106.139:7700';
const MEILI_KEY = process.env.MELISEARCH_MASTER_KEY || 'uqgNSaNNO8lJD9Uz2EpEHUM2sRteso5j4wH2qQD1M';
const INDEX = 'projects';

const MEILI_URL_NEW = 'http://23.239.106.139:7701';
const MEILI_KEY_NEW = process.env.MELISEARCH_MASTER_KEY_NEW || MEILI_KEY; // or set a new env var if needed

// Default coordinates for Austin, TX, United States
const DEFAULT_GEO = { lat: 30.267153, lng: -97.7430608 };

const OptimizedRoleSchema = z.object({
  role_id: z.number().default(0),
  name: z.string().default(''),
  gender: z.array(z.string()).default([]),
  age_range: z.object({ min: z.number().default(0), max: z.number().default(0) }).default({ min: 0, max: 0 }),
  ethnicity: z.array(z.string()).default([]),
  number_of_people: z.number().default(0),
  description: z.string().default(''),
  shoot_date: z.number().nullable().default(null),
  expiration_date: z.number().nullable().default(null),
  last_modified: z.number().nullable().default(null),
  status: z.number().default(0),
});

const OptimizedDocSchema = z.object({
  casting_id: z.number().default(0),
  status: z.number().default(0),
  user_id: z.number().default(0),
  title: z.string().default(''),
  project: z.string().default(''),
  description: z.string().default(''),
  location: z.object({
    city: z.string().default(''),
    market: z.string().default(''),
  }).default({ city: '', market: '' }),
  address_url: z.string().nullable().default(null),
  rate: z.object({
    amount: z.number().default(0),
    description: z.number().default(0),
    scale: z.number().default(0),
    agency_rate: z.number().default(0),
    paid: z.boolean().default(false),
    union: z.number().default(0),
  }).default({ amount: 0, description: 0, scale: 0, agency_rate: 0, paid: false, union: 0 }),
  dates: z.object({
    submission: z.number().nullable().default(null),
    created: z.number().nullable().default(null),
    last_modified: z.number().nullable().default(null),
    asap: z.number().nullable().default(null),
    audition: z.number().nullable().optional(),
    shoot: z.number().nullable().optional(),
  }).default({ submission: null, created: null, last_modified: null, asap: null }),
  contact: z.object({
    email: z.string().nullable().default(null),
  }).default({ email: null }),
  quality_level: z.number().default(0),
  roles: z.array(OptimizedRoleSchema).default([]),
  _geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
  categories: z.string().default(''),
  type: z.number().default(0),
  apps: z.array(z.number()).default([]),
});

export default async function migrateAllProjects() {
  let offset = 0;
  const limit = 1000;
  let totalDocs = 0;

  while (true) {
    // Download chunk from old Meilisearch
    const res = await fetch(`${MEILI_URL}/indexes/${INDEX}/documents?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${MEILI_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`Failed to fetch docs: ${res.statusText}`);
    const docs = await res.json();
    const chunk = docs.results ? docs.results : docs;

    if (chunk.length === 0) break;

    // Ensure every document has a _geo field and roles field, and validate/correct all fields
    for (let i = 0; i < chunk.length; i++) {
      let doc = chunk[i];
      // _geo
      if (
        !doc._geo ||
        typeof doc._geo !== 'object' ||
        typeof doc._geo.lat !== 'number' ||
        typeof doc._geo.lng !== 'number'
      ) {
        doc._geo = { ...DEFAULT_GEO };
        console.log(`Corrected _geo for doc ${doc.casting_id}`);
      }
      // roles
      if (!Array.isArray(doc.roles)) {
        doc.roles = [];
        console.log(`Corrected roles for doc ${doc.casting_id}`);
      }
      // Ensure every role has all required fields
      for (let j = 0; j < doc.roles.length; j++) {
        const role = doc.roles[j] || {};
        const resultRole = OptimizedRoleSchema.safeParse(role);
        if (!resultRole.success) {
          const fixedRole: any = { ...role };
          for (const issue of resultRole.error.issues) {
            const path = issue.path;
            if (path[0] === 'role_id' || path[0] === 'number_of_people' || path[0] === 'status') {
              fixedRole[path[0]] = 0;
            } else if (path[0] === 'name' || path[0] === 'description') {
              fixedRole[path[0]] = '';
            } else if (path[0] === 'gender' || path[0] === 'ethnicity') {
              fixedRole[path[0]] = [];
            } else if (path[0] === 'age_range') {
              fixedRole.age_range = { min: 0, max: 0 };
            } else if (path[0] === 'shoot_date' || path[0] === 'expiration_date' || path[0] === 'last_modified') {
              fixedRole[path[0]] = null;
            }
            console.log(`Corrected roles[${j}].${path.join('.')} for doc ${doc.casting_id}`);
          }
          // Validate again after fixing
          const retryRole = OptimizedRoleSchema.safeParse(fixedRole);
          if (retryRole.success) {
            doc.roles[j] = retryRole.data;
          } else {
            console.error(`Role in doc ${doc.casting_id} is still invalid after correction, removing.`);
            doc.roles[j] = OptimizedRoleSchema.parse({}); // fallback to empty role
          }
        } else {
          doc.roles[j] = resultRole.data;
        }
      }
      // Validate and correct all fields using zod
      const result = OptimizedDocSchema.safeParse(doc);
      if (!result.success) {
        // Try to fix each field
        const fixed: any = { ...doc };
        for (const issue of result.error.issues) {
          const path = issue.path;
          if (path[0] === 'casting_id' || path[0] === 'status' || path[0] === 'user_id' || path[0] === 'quality_level' || path[0] === 'type') {
            fixed[path[0]] = 0;
          } else if (path[0] === 'title' || path[0] === 'project' || path[0] === 'description' || path[0] === 'categories') {
            fixed[path[0]] = '';
          } else if (path[0] === 'address_url') {
            fixed[path[0]] = null;
          } else if (path[0] === 'roles' || path[0] === 'apps') {
            fixed[path[0]] = [];
          } else if (path[0] === 'location') {
            fixed.location = { city: '', market: '' };
          } else if (path[0] === 'rate') {
            fixed.rate = { amount: 0, description: 0, scale: 0, agency_rate: 0, paid: false, union: 0 };
          } else if (path[0] === 'dates') {
            fixed.dates = { submission: null, created: null, last_modified: null, asap: null };
          } else if (path[0] === 'contact') {
            fixed.contact = { email: null };
          } else if (path[0] === '_geo') {
            fixed._geo = { ...DEFAULT_GEO };
          }
          console.log(`Corrected ${path.join('.')} for doc ${doc.casting_id}`);
        }
        // Validate again after fixing
        const retry = OptimizedDocSchema.safeParse(fixed);
        if (retry.success) {
          chunk[i] = retry.data;
        } else {
          console.error(`Doc ${doc.casting_id} is still invalid after correction, skipping.`);
          chunk[i] = null; // Mark for removal
        }
      } else {
        chunk[i] = result.data;
      }
    }
    // Remove any nulls (invalid docs)
    const validChunk = chunk.filter(Boolean);

    // Upload chunk to new Meilisearch
    const uploadRes = await fetch(`${MEILI_URL_NEW}/indexes/${INDEX}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MEILI_KEY_NEW}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(validChunk)
    });
    if (!uploadRes.ok) {
      console.error(`Failed to upload chunk at offset ${offset}: ${uploadRes.statusText}`);
      const errorText = await uploadRes.text();
      console.error(errorText);
      break;
    }

    totalDocs += validChunk.length;
    console.log(`Migrated ${validChunk.length} documents (offset: ${offset}, total: ${totalDocs})`);
    if (chunk.length < limit) break;
    offset += limit;
  }

  console.log(`Migration complete. Total migrated: ${totalDocs}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

await migrateAllProjects();
process.exit(0);