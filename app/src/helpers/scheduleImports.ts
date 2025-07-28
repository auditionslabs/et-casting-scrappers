

export async function scheduleImports(data: Array<any>, roleId: number, cdUserId?: number | 0 ) {


    const url = 'https://api.exploretalent.com/v1/admin/schedule_imports';
    const headers = {
        'authorization': `Bearer ${process.env.EXPLORE_TALENT_API_KEY}`,
        'content-type': 'application/json',
        'Accept': '*/*',
        'Origin': 'https://trm.exploretalent.com',
        'Referer': 'https://trm.exploretalent.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        "sec-ch-ua" : '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
        "sec-ch-ua-mobile" : '?0',
        "sec-ch-ua-platform" : '"Windows"',
        "Sec-Fetch-Site" : "same-site",



    }   
    const body = {
        query: data,
        bam_role_id: roleId,
        bam_user_id: 9507,
        bam_cd_user_id: cdUserId,
    }
    console.log(JSON.stringify(body, null, 2));
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });
    return await response.json();
}