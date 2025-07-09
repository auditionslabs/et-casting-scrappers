import dotenv from 'dotenv'


dotenv.config()



export async function convertLocationToCoordinates(location: string): Promise<{ lat: number, lng: number }> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const response = await fetch(url)
    const data = await response.json()
    return data.results[0].geometry.location
}