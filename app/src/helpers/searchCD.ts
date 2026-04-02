// Search if CD user exits in the database. If it exists then return the user id. 
// If it does not exist then return user id 1, user_email = "booking@exploretalent.com"

import { db } from '../config/database.js'
import logger from '../config/logger.js'
import { createCDByCompany, createCDByName } from './createCD.js';


export async function searchCDByCompany(company: string) {
    /**
     * Search for a CD user in the database.
     * @param company - The company name to search for.
     * @returns The user id and email of the CD user.
     */
    if (!company) {
        return {
            id: 1,
            email: 'booking@exploretalent.com',
        }
    }

    const sanitizedCompany = company.replace(/'/g, "''").replace('.', '').replace(',', '');
    const query = db.selectFrom('cd_user').selectAll()
        .where((eb) => eb.or([
            eb('company', '=', sanitizedCompany),
            eb('company', 'like', `%${sanitizedCompany}%`)
        ]))

    try {

        const user = await query.execute();
        if (user && user.length > 0) {
            return {
                id: user[0].user_id,
                email: user[0].email1,
            }
        } else {
            await createCDByCompany(sanitizedCompany);

            const created = await query.execute();
            logger.info('CD user created lookup:', created);

            if (created && created.length > 0) {
                return {
                    id: created[0].user_id,
                    email: created[0].email1 ?? 'booking@exploretalent.com',
                };
            }
            logger.warn(
                'No local cd_user row after Explore Talent create; using fallback booking user. Check EXPLORE_TALENT_API_KEY and DB sync.'
            );
            return {
                id: 1,
                email: 'booking@exploretalent.com',
            };
        }
    } catch (error) {

        logger.error('Error searching CD user:', error)
        logger.error("Query: ", JSON.stringify(query.compile(), null, 2))
        return {
            id: 1,
            email: 'booking@exploretalent.com',
        }
    }
}


export async function searchCDByName(name: string): Promise<{ id: number, email: string }> {
    /**
     * Search for a CD user in the database by name.
     * @param name - The name to search for.
     * @returns The user id and email of the CD user.
     */
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || null; // null if empty

    let query = db.selectFrom('cd_user').selectAll()
    if (lastName) {
        query = query.where((eb) => eb.and([
            eb('fname', 'like', `%${firstName}%`),
            eb('lname', 'like', `%${lastName}%`)
        ]))
    } else {
        query = query.where((eb) => eb.and([
            eb('fname', 'like', `%${firstName}%`),
            eb.or([
                eb('lname', 'is', null),
                eb('lname', '=', '')
            ])
        ]))
    }
    //   const query = db
    //     .selectFrom('cd_user')
    //     .selectAll()
    //     .where(eb => eb.and([
    //       eb('fname', 'like', `%${firstName}%`),
    //       lastName 
    //         ? eb('lname', 'like', `%${lastName}%`) 
    //         : eb.or([
    //             eb('lname', 'is', null),
    //             eb('lname', '=', '')
    //           ])
    //     ]))
    logger.info(`Query: ${query.compile()}`)
    try {
        const user = await query.execute();
        if (user && user.length > 0 && user[0].email1) {
            return {
                id: user[0].user_id,
                email: user[0].email1,
            }
        } else {
            await createCDByName(firstName, lastName || "lname");
            const created = await query.execute();
            logger.info('CD user created lookup:', created);
            if (created && created.length > 0) {
                return {
                    id: created[0].user_id,
                    email: created[0].email1 ?? 'booking@exploretalent.com',
                };
            }
            logger.warn(
                'No local cd_user row after Explore Talent create; using fallback booking user. Check EXPLORE_TALENT_API_KEY and DB sync.'
            );
            return {
                id: 1,
                email: 'booking@exploretalent.com',
            };
        }
    } catch (error) {
        logger.error('Error searching CD user:', error)
        return {
            id: 1,
            email: 'booking@exploretalent.com',
        }
    }
}