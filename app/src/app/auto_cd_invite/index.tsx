import logger from '../../config/logger.js'
import { llm } from '../../config/llm.js'
import { db } from '../../config/database.js'
import { getCurrentTimestamp } from '../../utils/dateUtils.js'
import { updateProjectLocations } from '../../helpers/markets.js'
import { scheduleImports } from '../../helpers/scheduleImports.js'
import { getMatchesFilter } from './create_match_filter.js'
import { createCDMessage } from './create_cd_message.js'
import { createCDInvite } from '../../helpers/createCDInvite.js'


export async function autoCDInvite() {

    const projects = await db.selectFrom('castings')
        .selectAll()
        .where('asap', '>=', getCurrentTimestamp())
        .where('status', '=', 1)
        .orderBy('asap', 'desc')
        .where('casting_id', '=', 1676835)
        .execute()

        

    for (const project of projects) {
        if (project.market_id == null) {
            await updateProjectLocations(project.casting_id);
        }


        const roles = await db.selectFrom('roles')
            .selectAll()
            .where('casting_id', '=', project.casting_id)
            .execute();

        for (const role of roles) {

            // Build filter for each role
            const filter = getMatchesFilter(role, project);
            logger.info('Role:', role);
            logger.info('Project:', project);
            logger.info('Role filter:', filter);
            logger.info('--------------------------------');
            const response = await scheduleImports(filter, role.role_id, project.user_id || 0)
            logger.info('Response:', response);

            const cdInviteMessage = await createCDMessage(role, project);
            logger.info('Message:', cdInviteMessage);

            const cdInviteTitle = project.name + ' - ' + role.name + ' - ' + String(role.role_id);

            const invite = await createCDInvite(role.role_id, cdInviteTitle, cdInviteMessage);
            logger.info('Invite:', invite);

            await new Promise(resolve => setTimeout(resolve, 1000));

        }

    }
}


await autoCDInvite();
process.exit(0);