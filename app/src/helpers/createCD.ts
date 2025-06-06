import { formatDateToMySQL, getCurrentTimestamp } from '../utils/dateUtils.js';
import logger from '../config/logger.js';
import { db } from '../config/database.js';
import { CdUser } from '../models/admin/CdUser.js';
import { Md5 } from 'ts-md5';
export async function addCDUserToLaretUsers(email: string) {
    const user = (await db.selectFrom('cd_user').selectAll().where('email1', '=', email).executeTakeFirst()) as unknown as CdUser;
    logger.info(`Creating Laret User: ${JSON.stringify(user)}`);
    const duplicate = (await db.selectFrom('laret_users').selectAll().where('email', '=', email).execute()).length >= 1;
    if (!duplicate) {
        await db.insertInto('laret_users').values({
            email: email,
            password: Md5.hashStr(user.pass || ''),
            bam_cd_user_id: Number(user.user_id),
            active: 1,
            bam_user_id: 0,
            bam_talentnum: 0,
            verified: 0,
            created_at: formatDateToMySQL(new Date()),
            updated_at: formatDateToMySQL(new Date()),
            
        }).execute();
    }
}

export async function createCDByCompany(company_name: string) {
    const company_name_slug = company_name.toLowerCase().replace(/ /g, '-')
    const email = `${company_name_slug}@gmail.com`
    const pass = `${company_name_slug}@12345`
    const login = `${company_name_slug}`
    const body = new URLSearchParams();
    body.append('company', company_name)
    body.append('fname', company_name_slug)
    body.append('email1', email)
    body.append('lname', company_name_slug)
    body.append('pass', pass)
    body.append('login', login)
    body.append('status', '1')
    body.append('reviewed', '0')
    body.append('cd_type', '3')
    body.append('call_status', '0')
    body.append('absolete', '0')
    body.append('messaging', '0')
    body.append('date_created', getCurrentTimestamp().toString())

    const response = await fetch("https://api.exploretalent.com/v1/admin/cd_users", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-IN,en;q=0.5",
            "authorization": `Bearer ${process.env.EXPLORE_TALENT_API_KEY}`,
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Chromium\";v=\"136\", \"Brave\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"et-webscrapper\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "Referer": "https://trm.exploretalent.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: 'POST',
        body: body.toString()
    });

    logger.info(`CD created with company name: ${company_name}`);
    logger.info(`API Response: ${JSON.stringify(response)}`);
    await addCDUserToLaretUsers(email);
}

export async function createCDByName(fname: string, lname: string ) {
    const fname_slug = fname.toLowerCase().replace(/ /g, '-')
    const lname_slug = lname.toLowerCase().replace(/ /g, '-')
    const email = `${fname_slug}.${lname_slug}@gmail.com`
    const pass = `${fname_slug}_${lname_slug}@12345`
    const login = `${fname_slug}.${lname_slug}`

    const body = new URLSearchParams();
    body.append('fname', fname)
    body.append('lname', lname)
    body.append('email1', email)
    body.append('pass', pass)
    body.append('login', login)
    body.append('status', '1')
    body.append('reviewed', '0')
    body.append('cd_type', '3')
    body.append('call_status', '0')
    body.append('absolete', '0')
    body.append('messaging', '0')
    body.append('date_created', getCurrentTimestamp().toString())

    const response = await fetch("https://api.exploretalent.com/v1/admin/cd_users", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-IN,en;q=0.5",
            "authorization": `Bearer ${process.env.EXPLORE_TALENT_API_KEY}`,
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Chromium\";v=\"136\", \"Brave\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"et-webscrapper\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",  
            "sec-gpc": "1",
            "Referer": "https://trm.exploretalent.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: 'POST',
        body: body.toString()
    });

    logger.info(`CD created: ${fname} ${lname}`)
    logger.info(`API Response: ${JSON.stringify(response)}`)
    await addCDUserToLaretUsers(email);
}