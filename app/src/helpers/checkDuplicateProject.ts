// Search if the project already exists in the database. If it exists then return the project id. 
// If it does not exist then return 0.

import { db } from '../config/database.js'
import logger from '../config/logger.js'

export async function searchDuplicateProject(project_title: string) {
    /**
     * Search for a duplicate project in the database.
     * @param project_title - The project title to search for.
     * @returns true if the project exists, false if it does not.
     */

    try {
        const query = db.selectFrom('castings').selectAll()
        .where((eb) => eb.or([
            eb('name', '=', project_title),
            eb('name', 'like', `%${project_title}%`)
          ]))
        .orderBy('date_created', 'desc')
        
        const projects = await query.executeTakeFirst()
        if (projects) {
            return true;
        } else {
            return false;
        }


    } catch (error) {
        logger.error('Error searching duplicate project:', error)
        return false;
    }
}
