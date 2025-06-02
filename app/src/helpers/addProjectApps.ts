// add which whitelabled website to show the project on. uses the laret_casting_apps table.

import { db } from '../config/database.js'
import logger from '../config/logger.js'
import { Listing } from '../app/project_casting/scrape_listings.js'
import { formatDateToMySQL } from '../utils/dateUtils.js'


export async function addProjectApps(listing: Listing) {
    try {
        const query = db.selectFrom('castings')
            .selectAll()
            .where('address2', 'like', `%${listing.job_url}%`)
            .where(eb => 
                eb.or([
                    eb('name', '=', listing.title),
                    eb('name', 'like', `%${listing.title}%`),
                    eb('address2', '=', listing.job_url),
                    eb('address2', 'like', `%${listing.job_url}%`)
                ])
            )
            .orderBy('date_created', 'desc');
        // console.log("Query: ", query.compile())
        const casting = await query.execute();
    if (casting.length === 0) {
        logger.error('Casting not found:', listing.title, listing.job_url);
        return;
    }
    const currentDate = formatDateToMySQL(new Date());
    const casting_id = casting[0].casting_id;
    await db.insertInto('laret_casting_apps').values([{
        casting_id: casting_id,
        app_id: 1,
        created_at: currentDate,
        updated_at: currentDate,
    }, {
        casting_id: casting_id,
        app_id: 4,
        created_at: currentDate,
        updated_at: currentDate,
    }]).execute();

    } catch (error) {
        logger.error('Error adding project apps:', error)
    }
}