

import logger from '../config/logger.js';
import dotenv from 'dotenv';
dotenv.config();

export async function duplicateGHLForm(originalFormID: string, newFormTitle: string) {
    const url = `https://services.leadconnectorhq.com/forms/duplicate/${originalFormID}`;
    const body = {
        name: newFormTitle
    }
    const headers = {
        'content-type': 'application/json',
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.6',
        channel: 'APP',
        origin: 'https://app.gohighlevel.com',
        priority: 'u=1, i',
        referer: 'https://app.gohighlevel.com/',
        'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'sec-gpc': '1',
        source: 'WEB_USER',
        'token-id': `${process.env.GHL_TOKEN}`,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        version: '2021-07-28'
    }
    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 1000));
        return data._id;
    } catch (error) {
        logger.error('Error duplicating GHL Form:' + error);
        console.error(error);
        throw error;
    }
}