import { CdUser } from '@/models/admin/CdUser'
import { Castings } from '@/models/admin/Castings'
import { laret_casting_apps } from '@/models/admin/laret_casting_apps'
import { Roles } from '@/models/admin/Roles'
export interface Database {
  cd_user: CdUser,
  castings: Castings,
  roles: Roles,
  laret_casting_apps: laret_casting_apps
}