import { CdUser } from '@/models/admin/CdUser'
import { Castings } from '@/models/admin/Castings'
import { laret_casting_apps } from '@/models/admin/laret_casting_apps'

export interface Database {
  cd_user: CdUser,
  castings: Castings,
  laret_casting_apps: laret_casting_apps
}