import logger from '../config/logger.js';


export async function createCDInvite(roleId: number, name:string, description:string) {

    const url = "https://api.exploretalent.com/v1/admin/campaigns";
    const headers = {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.6",
        'authorization': `Bearer ${process.env.EXPLORE_TALENT_API_KEY}`,
        "Content-Type": "application/json; charset=UTF-8",
        "Origin": "https://trm.exploretalent.com",
    }
    const body = {
        campaign_type_id: 2,
        bam_cd_user_id: 0,
        bam_role_id: roleId,
        name: name,
        description: description,
        query_model: "\\App\\Models\\Bam\\Talentci",
        query_model_raw: "\\App\\Models\\Bam\\Talentci",
        query_key_id: "talentnum",
        query_key_cell: "cell",
        query_key_email: "email1",
        query: `[["join","bam.laret_users","bam.laret_users.bam_talentnum","=","bam.talentci.talentnum"],["join","bam.laret_schedules","bam.laret_schedules.invitee_id","=","bam.laret_users.id"],["where","bam.laret_schedules.rating","!=",0],["where","bam.laret_schedules.bam_role_id","=",${roleId}]]`,
        replies: 1,
        status: 0,
    }
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });
    return await response.json();
}
