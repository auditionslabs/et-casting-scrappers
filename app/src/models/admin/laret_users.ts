
import { Generated } from "kysely";

export interface laret_users {
    id: Generated<number>,
    email: string,
    password: string,
    active: number | 0,
    bam_user_id: number,
    bam_cd_user_id: number,
    bam_talentnum: number,
    verified: number | 0,
    created_at: string | '0000-00-00 00:00:00',
    updated_at: string | '0000-00-00 00:00:00',
    deleted_at: string | null,
}