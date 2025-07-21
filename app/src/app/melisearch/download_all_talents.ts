import dotenv from 'dotenv';
dotenv.config();

const MEILI_URL = process.env.MELISEARCH_BASE_URL || 'http://23.239.106.139:7700';
const MEILI_KEY = process.env.MELISEARCH_MASTER_KEY || 'uqgNSaNNO8lJD9Uz2EpEHUM2sRteso5j4wH2qQD1M';
const INDEX = 'talents';

const MEILI_URL_NEW = 'http://23.239.106.139:7701';
const MEILI_KEY_NEW = process.env.MELISEARCH_MASTER_KEY_NEW || MEILI_KEY; // or set a new env var if needed

export default async function migrateAllTalents() {
  let offset = 600000;
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

    // Upload chunk to new Meilisearch
    const uploadRes = await fetch(`${MEILI_URL_NEW}/indexes/${INDEX}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MEILI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chunk)
    });
    if (!uploadRes.ok) {
      console.error(`Failed to upload chunk at offset ${offset}: ${uploadRes.statusText}`);
      const errorText = await uploadRes.text();
      console.error(errorText);
      break;
    }

    totalDocs += chunk.length;
    console.log(`Migrated ${chunk.length} documents (offset: ${offset}, total: ${totalDocs})`);
    if (chunk.length < limit) break;
    offset += limit;
  }

  console.log(`Migration complete. Total migrated: ${totalDocs}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

await migrateAllTalents();
process.exit(0);