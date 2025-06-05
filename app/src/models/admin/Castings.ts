import { Generated, ColumnType } from 'kysely'

export interface Castings {
  casting_id: Generated<number>
  status: number | null
  user_id: number | null
  address1: string | null
  address2: string | null
  city: string | null
  state: string | null
  zip: string | null
  email1: string | null
  name: string | null
  project: string | null
  project_type: number | null
  union2: number | null
  usage2: string | null
  production: string | null
  artist: string | null
  track: string | null
  excusivity: string | null
  photographer: string | null
  location: string | null
  rate: number | null
  rate_des: number | null
  rate_scale: number | null
  bam_only: number | null
  agency_rate: number | null
  sub_timestamp: number | null
  aud_timestamp: number | null
  shoot_timestamp: number | null
  date_created: number | null
  last_modified: number | null
  des: string | null
  asap: number | null
  cat: number | null
  market: string | null
  email_sub: number | null
  paper_sub: number | null
  snr: number | null
  snr_email: string | null
  welcome: number | null
  wel_sent: number | null
  qlty_level: number | null
  past: number | null
  staff_id: number | null
  by_app_only: number | null
  app_date_time: string | null
  app_loc: string | null
  srn_address: string | null
  country: string | null
  name_original: string | null
  slug: string | null
  is_archive: number | null
  market_id: string | null
  required_phone: '0' | '1'
  required_photo: '0' | '1'
  currency_code: string | null
  expected_time: number
  paid: '0' | '1'
  expected_hours_min: number | null
  expected_hours_max: number | null
  compensation_bonus: string | null
  notify_through: number
}

export interface Database {
  castings: Castings
}


