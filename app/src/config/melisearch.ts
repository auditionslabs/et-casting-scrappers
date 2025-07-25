import { type Castings } from '../models/admin/Castings.js'
import { type Roles } from '../models/admin/Roles.js'
import { type MappedJob } from '../types/casting.js'
import dotenv from 'dotenv'

dotenv.config()




export async function addPorjectToMelisearch(doc:any, index:string) {

    try {
        const project = await fetch(`${process.env.MELISEARCH_BASE_URL}/indexes/${index}/documents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MELISEARCH_MASTER_KEY}`
            },
            body: JSON.stringify([doc])
        })

        const data = await project.json();
        return data
    }
    catch (error) {
        console.error(error)
    }
}




