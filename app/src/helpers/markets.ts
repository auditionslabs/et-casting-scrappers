import { llm } from "../config/llm.js";
import z from "zod";
import { generateObject } from "ai";
import logger from "../config/logger.js";
import {db} from "../config/database.js";




interface Market {
    market_id: number;
    market: string;
    lat: number;
    lon: number;
}

async function getAllMarkets(): Promise<Market[]> {
    return db.selectFrom('markets')
        .select(['market_id', 'market', 'lat', 'lon'])
        .execute();
}

async function updateProject(castingId: number, market: string, marketId: number, zipCode: string) {

    if (market === 'N/A') {
        await db.updateTable('castings')
            .set({
                market: '',
                location: 'N/A',
                zip: 'N/A',
                market_id: ''
            })
            .where('casting_id', '=', castingId)
            .execute();
    }
    else {
        await db.updateTable('castings')
            .set({
                market: market,
                location: market,
                market_id: marketId?.toString() || 'N/A'
            })
            .where('casting_id', '=', castingId)
            .execute();
    }
    logger.info(`Updated project ${castingId} location to ${market} and market_id to ${marketId}`);
}


export async function updateProjectLocations(project_id:number) {
    const project = await db.selectFrom('castings').selectAll().where('casting_id', '=', project_id).executeTakeFirst();
    const markets = await getAllMarkets();
    const allMarketsString = markets.map((m) => m.market).join(', ')

   

        // Use LLM to find the closest market name
    const prompt = `Given the project location: "${project?.location}", and the following list of markets: ${allMarketsString}, return the market name that is the closest match to the project location. Return the market name, market_id, and zip_code as a JSON object: {\"market\": \"<market name>\", \"market_id\": <market id>, \"zip_code\": \"<zip code>\"}. if the market is nationwide, united states, or usa, return "N/A" for the market name, market_id, and zip_code.`;
    try {
        const { object } = await generateObject({
            model: llm,
            schema: z.object({
                market: z.string(),
                market_id: z.number(),
                zip_code: z.string().optional(),
            }),
            mode: 'json',
            prompt,
        });

        const closestMarket = object.market;
        const marketId = markets.find(m => m.market === closestMarket)?.market_id;
        const zipCode = object.zip_code || '';

        // Cache the result
        logger.info(`Updated project ${project_id} location from ${project?.location} to ${closestMarket} and market_id to ${marketId} and zip code to ${zipCode}`);
        await updateProject(project_id, closestMarket, marketId!, zipCode);
    } catch (error) {
        logger.error(`Failed to update project ${project_id}:`, error);
    }
}