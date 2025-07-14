import dotenv from 'dotenv'
import logger from './logger.js'


dotenv.config()



export async function convertLocationToCoordinates(location: string): Promise<{ lat: number, lng: number }> {
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        const response = await fetch(url)
        const data = await response.json()
        return data.results[0].geometry.location
    }
    catch (error) {
        logger.error(`Error converting location to coordinates for ${location}`, error)
        return { lat: 38.7945952, lng: -106.5348379 }
    }
}