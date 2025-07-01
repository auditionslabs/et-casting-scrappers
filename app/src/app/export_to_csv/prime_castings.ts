// export a categotycal excel file where each category has a sheet and the sheet contains the top 100 jobs for that category based on the project quality, rate and the expiration date.


import { getCurrentTimestamp } from '../../utils/dateUtils.js';
import { db } from '../../config/database.js'
import logger from '../../config/logger.js'
import { CategoryEnum } from '../../types/casting.js'
import xlsx from 'xlsx'
import fs from 'fs';
import path, { resolve } from 'path';
import { rateDescription } from '../../types/casting.js';
import { summerizeDescription, getRoles } from './helper.js';

interface MappedItem {
    "Casting ID": number
    "Title": string
    "Description": string
    "Age Range": string,
    "Gender": string,
    "Pay": string,
    "Expiration Date": string,
    "Market": string,
    "TRM Admin URL": string,
    "ET Public URL": string,
}


export async function exportByCategory() {

    const rateDescriptionValueToKey = Object.fromEntries(Object.entries(rateDescription).map(([key, value]) => [value, key]));
    try {
        // Create exports directory if it doesn't exist
        const exportsDir = path.join(process.cwd(), 'exports');
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir, { recursive: true });
        }
        const workbook = xlsx.utils.book_new()
        
        try {
            const query = db.selectFrom('castings as c')
                    .select(['c.casting_id', 'c.name', 'c.rate', 'c.des', 'c.rate_des', 'c.asap', 'c.market'])
                    .where('qlty_level', '>=', 5)
                    .where('asap', '>=', getCurrentTimestamp())
                    .where('c.status', '=', 1)
                    .orderBy('rate', 'desc')
                    .orderBy('qlty_level', 'desc')
                    .orderBy('c.casting_id', 'desc')
                    .limit(150)

            const data = await query.execute()
            const updatedData: MappedItem[] = []
            if (data.length > 0 && updatedData.length <= 100) {

                for (const item of data) {
                    const roles = await getRoles(item.casting_id)
                    if (roles.length > 0) {
                    const summary = await summerizeDescription(item.des || '', JSON.stringify(roles) || '');
                    new Promise((resolve) => setTimeout(resolve,500));
                    updatedData.push({
                        "Casting ID": item.casting_id,
                        "Title": item.name || '',
                        "Pay": `${item.rate}/ ${rateDescriptionValueToKey[item.rate_des as keyof typeof rateDescriptionValueToKey]}`,
                        "Description":summary,
                        "Age Range": `${roles[0].age_min} - ${roles[0].age_max}`,
                        "Gender": roles[0].gender_male && roles[0].gender_female ? 'Any' : roles[0].gender_male ? 'Male' : roles[0].gender_female ? 'Female' : 'Any',
                        "TRM Admin URL": `https://trm.exploretalent.com/cd/projects/${item.casting_id}/edit`,
                        "Expiration Date": new Date((item.asap || 0) * 1000).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                            "Market": item.market || '',
                            "ET Public URL": `https://www.exploretalent.com/auditions/${item.casting_id}`,
                        })
                    }
                }
                const worksheet = xlsx.utils.json_to_sheet(updatedData)
                xlsx.utils.book_append_sheet(workbook, worksheet, 'Prime Castings')
            }
            const filePath = path.join(exportsDir, 'prime_castings.xlsx');
            xlsx.writeFile(workbook, filePath);
        } catch (error) {
            console.error('Error exporting by category:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error exporting by category:', error);
        throw error;
    } finally {
        console.log('Exported prime castings')
        process.exit(0)
    }
}

exportByCategory()



