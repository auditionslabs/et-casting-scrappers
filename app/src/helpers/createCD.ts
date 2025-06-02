import { getCurrentTimestamp } from '../utils/dateUtils.js';

export async function createCD(company_name: string) {
    const company_name_slug = company_name.toLowerCase().replace(/ /g, '-')

    const body = new URLSearchParams();
    body.append('company', company_name)
    body.append('fname', company_name_slug)
    body.append('email1', `${company_name_slug}@gmail.com`)
    body.append('lname', company_name_slug)
    body.append('pass', `${company_name_slug}@12345`)
    body.append('login', company_name_slug)
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
}