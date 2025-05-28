import { Database } from '../types/database' // this is the Database interface we defined earlier
import { createPool } from 'mysql2' // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from 'kysely'
import dotenv from 'dotenv'

dotenv.config()

const dialect = new MysqlDialect({
  pool: createPool({
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '3306'),
    connectionLimit: 10,
  })
})


export const db = new Kysely<Database>({
  dialect,
})