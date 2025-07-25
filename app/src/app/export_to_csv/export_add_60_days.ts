import { getCurrentTimestamp } from '../../utils/dateUtils.js';
import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { rateDescription } from '../../types/casting.js';
import { getRoles } from './helper.js';

export async function exportAdd60Days() {
  try {
    // Create exports directory if it doesn't exist
    const exportsDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    const workbook = xlsx.utils.book_new();
    const updatedData: any[] = [];
    const sixtyDaysAgo = Math.floor((Date.now() - 60 * 24 * 60 * 60 * 1000) / 1000);
    // Select all fields from castings
    const query = db.selectFrom('castings as c')
      .selectAll()
      .where('c.date_created', '>=', sixtyDaysAgo)
      .where('c.status', '=', 1);
      
    const data = await query.execute();
    console.log(data.length);
    for (const item of data) {
      const roles = await getRoles(item.casting_id);
      if (!roles || roles.length === 0) continue;
      for (const role of roles) {
        updatedData.push({
          ...item,
          ...role
        });
      }
    }
    const worksheet = xlsx.utils.json_to_sheet(updatedData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Castings 60 Days');
    const filePath = path.join(exportsDir, 'castings_60_days.xlsx');
    xlsx.writeFile(workbook, filePath);
    console.log('Exported castings with roles from the past 60 days');
    process.exit(0);
  } catch (error) {
    console.error('Error exporting castings:', error);
    process.exit(1);
  }
}

exportAdd60Days();
