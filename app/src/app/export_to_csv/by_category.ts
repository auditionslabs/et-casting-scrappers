// export a categotycal excel file where each category has a sheet and the sheet contains the top 100 jobs for that category based on the project quality, rate and the expiration date.


import { getCurrentTimestamp } from '../../utils/dateUtils.js';
import { db } from '../../config/database.js'
import logger from '../../config/logger.js'
import { CategoryEnum } from '../../types/casting.js'
import xlsx from 'xlsx'
import fs from 'fs';
import path from 'path';
import { rateDescription } from '../../types/casting.js';
import { getRoles, summerizeDescription } from './helper.js';
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
            await Promise.all(Object.entries(CategoryEnum).map(async ([key, value]) => {
                //cannot contain \ / ? * [ ]. sheet names cannot exceed 31 chars
                key = key.toLowerCase().replace(/[\\/\?*[\]]/g, '').slice(0, 31)
                const query = db.selectFrom('castings as c')
                    .select(['c.casting_id', 'c.name', 'c.rate', 'c.des', 'c.rate_des', 'c.address2', 'c.asap', 'c.market'])
                    // .innerJoin('roles as r', (join) => join.onRef('c.casting_id', '=', 'r.casting_id'))
                    // .select(['r.age_min', 'r.gender_male', 'r.gender_female', 'r.age_max'])
                    .where('cat', '=', value)
                    .where('qlty_level', '>=', 5)
                    .where('asap', '>=', getCurrentTimestamp())
                    .orderBy('qlty_level', 'desc')
                    .orderBy('rate', 'desc')
                    .orderBy('c.casting_id', 'desc')
                    .limit(100)

                console.log(query.compile())
                const data = await query.execute()
                
                if (data.length > 0) {
                    // console.log(JSON.stringify(data, null, 2));
                    // process.exit(0);
                    const updatedData: MappedItem[] = []
                    for (const item of data) {
                        const roles = await getRoles(item.casting_id)
                        const summary = await summerizeDescription(item.des || '', JSON.stringify(roles) || '');
                        updatedData.push({
                            "Casting ID": item.casting_id,
                            "Title": item.name || '',
                            "Pay": `${item.rate}/ ${rateDescriptionValueToKey[item.rate_des as keyof typeof rateDescriptionValueToKey]}`,
                            "Description": summary,
                            "Age Range": `${roles[0].age_min} - ${roles[0].age_max}`,
                            "Gender": roles[0].gender_male && roles[0].gender_female ? 'Any' : roles[0].gender_male ? 'Male' : roles[0].gender_female ? 'Female' : 'Any',
                            "TRM Admin URL": `https://trm.exploretalent.com/cd/projects/${item.casting_id}/edit`,
                            "Expiration Date": new Date((item.asap || 0) * 1000).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                            "Market": item.market || '',
                            "ET Public URL": `https://www.exploretalent.com/auditions/${item.casting_id}`,
                        })
                    }
                    // console.log(updatedData)
                    // process.exit(0);
                    const worksheet = xlsx.utils.json_to_sheet(updatedData);
                    xlsx.utils.book_append_sheet(workbook, worksheet, key);
                }
            }));
            const filePath = path.join(exportsDir, 'by_category.xlsx');
            xlsx.writeFile(workbook, filePath);
        } catch (error) {
            console.error('Error exporting by category:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error exporting by category:', error);
        throw error;
    }
    finally {
        console.log('Exported by category')
        process.exit(0)
    }
}

exportByCategory()



