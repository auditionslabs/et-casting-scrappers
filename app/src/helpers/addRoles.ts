import { Role } from "../types/roles.js";
import logger from "../config/logger.js";
import { Listing } from "../app/project_casting/scrape_listings.js";
import { generateObject } from "ai";
import { z } from "zod";
import { db } from "../config/database.js";
import { llm } from "../config/llm.js";
import { getFutureDate, parseDateToTimestamp } from "../utils/dateUtils.js";

type llmResponse = {
    results: Role[]
}

export async function addRoles(title: string, description: string, job_url: string) {


    logger.info("in add roles.")

    const query = db.selectFrom('castings').selectAll().where('address2', '=', job_url);
    //    console.log(query.compile());
    const casting = await query.executeTakeFirst();
    logger.info("Casting: ", JSON.stringify(casting));

    if (!casting) {
        logger.error('Casting not found:', title, job_url);
        return;
    }
    const casting_id = casting.casting_id;


    const schema = z.object({
        results: z.array(z.object({
            expiration_timestamp: z.number().default(parseDateToTimestamp(getFutureDate(new Date(), 30))),
            audition_timestamp: z.number().optional(),
            shoot_timestamp: z.number().optional(),
            name: z.string().optional(),
            number_of_people: z.number().optional(),
            des: z.string().optional(),
            gender_male: z.number().optional(),
            gender_female: z.number().optional(),
            age_min: z.number().default(3),
            age_max: z.number().default(80),
            height_min: z.number().optional(),
            height_max: z.number().optional(),
            ethnicity_any: z.number().optional(),
            ethnicity_african: z.number().optional(),
            ethnicity_african_am: z.number().optional(),
            ethnicity_asian: z.number().optional(),
            ethnicity_caribbian: z.number().optional(),
            ethnicity_caucasian: z.number().optional(),
            ethnicity_hispanic: z.number().optional(),
            ethnicity_mediterranean: z.number().optional(),
            ethnicity_middle_est: z.number().optional(),
            built_any: z.number().optional(),
            built_medium: z.number().optional(),
            built_athletic: z.number().optional(),
            built_bb: z.number().optional(),
            built_xlarge: z.number().optional(),
            built_large: z.number().optional(),
            built_petite: z.number().optional(),
            built_thin: z.number().optional(),
            built_lm: z.number().optional(),
            hair_any: z.number().optional(),
            hair_auburn: z.number().optional(),
            hair_black: z.number().optional(),
            hair_blonde: z.number().optional(),
            hair_brown: z.number().optional(),
            hair_chestnut: z.number().optional(),
            hair_dark_brown: z.number().optional(),
            hair_grey: z.number().optional(),
            hair_red: z.number().optional(),
            hair_salt_paper: z.number().optional(),
            hair_white: z.number().optional(),
        }))
    })

    const object = await generateObject({
        model: llm,
        schema: schema,
        prompt: `
        You are a casting director. You are given the listing of a job. You need to create roles for the job.
        Each role should contain the information for a particular person needed for the job. Males and females should be listed separately. Babies and children should be listed separately. For feature films add the roles for supporting and extras if there is no age specified use 1-80 as the age range. If there is no expiration date specified use 30 days from the date of the job posting. Height should be in inches. Create all the roles for the job from the listing details. use the original description of the job to create the roles. If there is no expiration date provided, use 30 days from today's date.
        Title: ${title}
        Description: ${description}
        Today's date is: ${new Date().toISOString()}
        `,
    });
    const llmResponse = object.object as llmResponse;

    // console.log(JSON.stringify(object, null, 2))
    const roles = llmResponse.results as Role[];

    for (const role of roles) {
        const body = new URLSearchParams();
        for (const key in role) {
            const value = role[key as keyof Role];
            if (value !== undefined) {
                body.append(key, value.toString());
            }
        }

        body.append('casting_id', casting_id.toString());
        // console.log("BODY: ", body.toString())

        try {
            const response = await fetch("https://api.exploretalent.com/v1/admin/jobs", {
                method: 'POST',
                body: body.toString(),
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-IN,en;q=0.5",
                    "authorization": `Bearer ${process.env.EXPLORE_TALENT_API_KEY}`,
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "sec-ch-ua": "\"Chromium\";v=\"136\", \"Brave\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "sec-gpc": "1",
                    "Referer": "https://trm.exploretalent.com/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
            });
            if (!response.ok) {
                logger.error('Error adding roles:', JSON.stringify(response));
            }

        } catch (error) {
            logger.error('Error adding roles:', error)
        }
    }
}
