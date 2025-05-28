import { CdUser } from '@/models/admin/CdUser'
import { Castings } from '@/models/admin/Castings'
export interface Database {
  cd_user: CdUser,
  castings: Castings
}