import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely'

export interface laret_casting_apps {
    id: Generated<number>,
    app_id: number,
    casting_id: number,
    created_at: string,
    updated_at: string,
}


// comes from laret_apps table.
export enum appId {
    "ExploreTalent.com" = 1,
    "Talent.ph" = 2,
    "Audition.com" = 4,
}