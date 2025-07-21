import { readFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const MEILI_URL = 'http://23.239.106.139:7701';
const MEILI_KEY = 'uqgNSaNNO8lJD9Uz2EpEHUM2sRteso5j4wH2qQD1M';
const INDEX = 'projects';
const BATCH_SIZE = 1000;

async function addAllProjects() {
  const filePath = path.join('projects.json');
  const raw = readFileSync(filePath, 'utf-8');
  const projects = JSON.parse(raw);

  let total = 0;
  for (let i = 0; i < projects.length; i += BATCH_SIZE) {
    const batch = projects.slice(i, i + BATCH_SIZE);
    const res = await fetch(`${MEILI_URL}/indexes/${INDEX}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MEILI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(batch)
    });
    if (!res.ok) {
      console.error(`Failed to add batch at index ${i}: ${res.statusText}`);
      const errorText = await res.text();
      console.error(errorText);
      break;
    } else {
      total += batch.length;
      console.log(`Added batch: ${batch.length} projects (total: ${total})`);
    }
  }
  console.log(`Finished adding ${total} projects to Meilisearch.`);
}

addAllProjects().catch((err) => {
  console.error('Error adding projects:', err);
  process.exit(1);
}); 