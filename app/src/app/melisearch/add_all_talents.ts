import fs from 'fs';
import dotenv from 'dotenv';
import pkg from 'stream-json/streamers/StreamArray.js';
const { streamArray } = pkg;
dotenv.config();

const MEILI_URL = process.env.MELISEARCH_BASE_URL || 'http://23.239.106.139:7701';
const MEILI_KEY = process.env.MELISEARCH_MASTER_KEY || 'uqgNSaNNO8lJD9Uz2EpEHUM2sRteso5j4wH2qQD1M';
const INDEX = 'talents';
const BATCH_SIZE = 1000;

async function addAllTalents() {
  return new Promise<void>((resolve, reject) => {
    const pipeline = fs.createReadStream('talents.json').pipe(streamArray());
    let batch: any[] = [];
    let total = 0;
    let batchNum = 1;

    pipeline.on('data', async ({value}) => {
      batch.push(value);
      if (batch.length >= BATCH_SIZE) {
        pipeline.pause();
        await sendBatch(batch, batchNum, total);
        total += batch.length;
        batchNum++;
        batch = [];
        pipeline.resume();
      }
    });

    pipeline.on('end', async () => {
      if (batch.length > 0) {
        await sendBatch(batch, batchNum, total);
        total += batch.length;
      }
      console.log(`Finished adding ${total} talents to Meilisearch.`);
      resolve();
    });

    pipeline.on('error', (err) => {
      reject(err);
    });
  });
}

async function sendBatch(batch: any[], batchNum: number, total: number) {
  const res = await fetch(`${MEILI_URL}/indexes/${INDEX}/documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MEILI_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(batch)
  });
  if (!res.ok) {
    console.error(`Failed to add batch ${batchNum}: ${res.statusText}`);
    const errorText = await res.text();
    console.error(errorText);
  } else {
    console.log(`Added batch ${batchNum}: ${batch.length} talents (total: ${total + batch.length})`);
  }
}

await addAllTalents();
process.exit(0);
