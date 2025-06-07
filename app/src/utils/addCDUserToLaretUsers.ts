import { db } from "../config/database.js";
import { CdUser } from "../models/admin/CdUser";     
import { laret_users } from "../models/admin/laret_users";
import {Md5} from 'ts-md5'
import { formatDateToMySQL } from "./dateUtils.js";


export async function addCDUserToLaretUsers() {
    const query = await db.selectFrom('cd_user').selectAll().where('pass', 'like', '%12345');
    const result = await query.execute();

    for (const user of result) {
        
        if (user.pass !== null && user.email1 !== null) {
            const duplicate = (await db.selectFrom('laret_users').selectAll().where('email', '=', user.email1).execute()).length >= 1;
            if (!duplicate) {
                await db.insertInto('laret_users').values({
                    email: user.email1,
                    password: Md5.hashStr(user.pass),
                    active: 1,
                    bam_user_id: 0,
                    bam_cd_user_id: user.user_id,
                    bam_talentnum: 0,
                    created_at: formatDateToMySQL(new Date()),
                    updated_at: formatDateToMySQL(new Date()),
                    verified: 0,
                }).execute();
            }
        }
    }
}

await addCDUserToLaretUsers();
process.exit(0);