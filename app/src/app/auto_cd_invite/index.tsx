import logger from '../../config/logger.js'
import { llm } from '../../config/llm.js'
import { db } from '../../config/database.js'
import { getCurrentTimestamp } from '../../utils/dateUtils.js'
import { updateProjectLocations } from '../../helpers/markets.js'
import { scheduleImports } from '../../helpers/scheduleImports.js'
import { getMatchesFilter } from './create_match_filter.js'
import { createCDMessage } from './create_cd_message.js'
import { createCDInvite } from '../../helpers/createCDInvite.js'
import { duplicateGHLForm } from '../../helpers/duplicateGHLForm.js'
import { updateGHLForm } from '../../helpers/updateGHLForm.js'


export async function autoCDInvite() {

    const projects = await db.selectFrom('castings')
        .selectAll()
        .where('asap', '>=', getCurrentTimestamp())
        .where('status', '=', 1)
        .orderBy('asap', 'desc')
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
            logger.info('Role filter:' + filter);
            logger.info('--------------------------------');
            const response = await scheduleImports(filter, role.role_id, project.user_id || 0)
            logger.info('Response:' + response);

            // const cdInviteMessage = await createCDMessage(role, project);
            // logger.info('Message:', cdInviteMessage);

            const cdInviteTitle = "Casting ID: " + project.casting_id + " Casting Name: " + project.name + " Role ID: " + role.role_id + " Role Name: " + role.name;
            logger.info('Title:' + cdInviteTitle);

            const ghlFormId = await duplicateGHLForm(process.env.GHL_BASE_FORM_ID || 'lnjkMQmM8xf8QNnOZp33', cdInviteTitle);
            logger.info('GHL Form ID:' + ghlFormId);

            const newFormDescription = "<p><b>Casting ID:</b> " + project.casting_id + "</p><p><b>Casting Name:</b> " + project.name + "</p><p><b>Role ID:</b> " + role.role_id + "</p><p><b>Role Name:</b> " + role.name + "</p>" + "<p><b>Number of talents required:</b> "+ role.number_of_people + "</p>" + "<p><b>Role description:</b> " + role.des + "</p>";

            const cdInviteMessage = "<button class='px-4 py-1 text-sm text-white font-semibold rounded-full border bg-green-600 font-bold'><a href='https://e.trmx.cc/widget/form/" + ghlFormId + "' target='_blank'> Click here to apply </a></button>";

            const updatedGHLForm = await updateGHLForm(ghlFormId, newFormDescription);
            logger.info('Updated GHL Form:', updatedGHLForm);

            const invite = await createCDInvite(role.role_id, cdInviteTitle, cdInviteMessage);
            logger.info('Invite:', invite);

            await db.updateTable('roles').set({
                ghl_form_id: ghlFormId,
            }).where('role_id', '=', role.role_id).execute();

            await new Promise(resolve => setTimeout(resolve, 1000));

        }

    }
}

await autoCDInvite();
process.exit(0);