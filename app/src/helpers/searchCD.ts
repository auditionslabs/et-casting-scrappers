// Search if CD user exits in the database. If it exists then return the user id. 
// If it does not exist then return user id 1, user_email = "booking@exploretalent.com"

import { db } from '../config/database.js'
import logger from '../config/logger.js'


export async function searchCD (company:string) {
    /**
     * Search for a CD user in the database.
     * @param company - The company name to search for.
     * @returns The user id and email of the CD user.
     */

    
    try {
        const query =  db.selectFrom('cd_user').selectAll()
        .where((eb) => eb.or([
            eb('company', '=', company),
            eb('company', 'like', `%${company}%`)
          ]))
        
        const user = await query.execute();
        console.log(company, user)
        if (user && user.length > 0) {
            return {
                user_id: user[0].user_id,
                user_email: user[0].email1,
            }
        } else {
            return {
                user_id: 1,
                user_email: 'booking@exploretalent.com',
            }
        }
    } catch (error) {
        logger.error('Error searching CD user:', error)
        return {
            user_id: 1,
            user_email: 'booking@exploretalent.com',
        }
    }
}


