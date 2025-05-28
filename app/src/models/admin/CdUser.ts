import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
  } from 'kysely'

export interface CdUser {
  user_id: Generated<number>
  type: number | null
  status: number | null
  login: string | null
  pass: string | null
  company: string | null
  fname: string | null
  lname: string | null
  address1: string | null
  address2: string | null
  city: string | null
  state: string | null
  zip: string | null
  email1: string | null
  email2: string | null
  website: string | null
  phone1: string | null
  phone2: string | null
  fax: string | null
  date_created: number | null
  last_modified: number | null
  des: string | null
  reviewed: number | null
  welcome: number | null
  wel_sent: number | null
  absolete: number | null
  cd_type: number | null
  call_status: number | null
  des2: string | null
  resource_id: number | null
  messaging: number | null
  staff_id: number | null
  last_mine_ts: number | null
  next_mine_ts: number | null
  mine_freq_hour: number | null
  current_state: number | null
  ip: string | null
  create_ip: string | null
  app_id: number | null
  dont_mine: number | null
  role: string | null
  country: string | null
  organisation: string | null
}