// Search if CD user exits in the database. If it exists then return the user id. 
// If it does not exist then return user id 1, user_email = "booking@exploretalent.com"

import { db } from '../config/database.js'
import logger from '../config/logger.js'
import { createCD } from './createCD.js';


export async function searchCD (company:string) {
    /**
     * Search for a CD user in the database.
     * @param company - The company name to search for.
     * @returns The user id and email of the CD user.
     */
    const sanitizedCompany = company.replace(/'/g, "''").replace('.', '').replace(',', '');
    const query =  db.selectFrom('cd_user').selectAll()
    .where((eb) => eb.or([
        eb('company', '=', sanitizedCompany),
        eb('company', 'like', `%${sanitizedCompany}%`)
      ]))

    try {
        
        const user = await query.execute();
        // console.log(company, user)
        if (user && user.length > 0) {
            // logger.info("CD user found: ", user)
            return {
                id: user[0].user_id,
                email: user[0].email1,
            }
        } else {
            await createCD(sanitizedCompany);

            const user = await query.execute();
            logger.info("CD user created: ", user)

            return {
                id: user[0].user_id,
                email: 'booking@exploretalent.com',
            }
        }
    } catch (error) {

        logger.error('Error searching CD user:', error)
        logger.error("Query: ", query.compile())
        return {
            id: 1,
            email: 'booking@exploretalent.com',
        }
    }
}


