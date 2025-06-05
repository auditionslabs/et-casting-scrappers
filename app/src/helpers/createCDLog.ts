import { getCurrentTimestamp } from '../utils/dateUtils.js';

export async function createCDLog(cd_id: number, description: string) {
    const body = new URLSearchParams();
    body.append('cd_user_id', cd_id.toString())
    body.append('des', description)
    body.append('date_created', getCurrentTimestamp().toString())
    body.append('staff_user_id', `${process.env.TRM_STAFF_USER_ID}`)
    fetch("https://api.exploretalent.com/v1/admin/cd_logs", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-IN,en;q=0.6",
            "authorization": `Bearer ${process.env.EXPLORE_TALENT_API_KEY}`,
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Chromium\";v=\"136\", \"Brave\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "Referer": "https://trm.exploretalent.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": body.toString(),
        "method": "POST"
    });
}