import { Role } from "../types/roles.js";
import logger from "../config/logger.js";
import { generateObject } from "ai";
import { z } from "zod";
import { db } from "../config/database.js";
import { llm, llm_pro } from "../config/llm.js";
import { getFutureDate, parseDateToTimestamp } from "../utils/dateUtils.js";
import { chromium, Browser } from 'playwright'

type llmResponse = {
    results: Role[]
}

export const rolesSchema = z.object({
    results: z.array(z.object({
        expiration_timestamp: z.number().default(parseDateToTimestamp(getFutureDate(new Date(), 30))),
        audition_timestamp: z.number().optional(),
        shoot_timestamp: z.number().optional(),
        name: z.string(),
        number_of_people: z.number().optional(),
        des: z.string(),
        gender_male: z.number().default(0).describe("1 if male talent is needed. 1 if both male and female talent is needed. 0 if not needed."),
        gender_female: z.number().default(0).describe("1 if female talent is needed. 1 if both male and female talent is needed. 0 if not needed."),
        age_min: z.number().default(3).describe("The minimum age of the talent needed. If no age is mentioned, use 2."),
        age_max: z.number().default(80).describe("The maximum age of the talent needed. If no age is mentioned, use 80."),
        height_min: z.number().optional().describe("The minimum height of the talent needed in inches."),
        height_max: z.number().optional().describe("The maximum height of the talent needed in inches."),
        ethnicity_any: z.number().optional().describe("1 if any ethnicity, 0 if not"),
        ethnicity_african: z.number().optional().describe("1 if african ethnicity, 0 if not"),
        ethnicity_african_am: z.number().optional().describe("1 if african american ethnicity, 0 if not"),
        ethnicity_asian: z.number().optional().describe("1 if asian ethnicity, 0 if not"),
        ethnicity_caribbian: z.number().optional().describe("1 if caribbean ethnicity, 0 if not"),
        ethnicity_caucasian: z.number().optional().describe("1 if caucasian ethnicity, 0 if not"),
        ethnicity_hispanic: z.number().optional().describe("1 if hispanic ethnicity, 0 if not"),
        ethnicity_mediterranean: z.number().optional().describe("1 if mediterranean ethnicity, 0 if not"),
        ethnicity_middle_est: z.number().optional().describe("1 if middle eastern ethnicity, 0 if not"),
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

export async function addRoleToET(role: Role, casting_id: number) {
    const body = new URLSearchParams();
    for (const key in role) {
        const value = role[key as keyof Role];
        if (value !== undefined) {
            body.append(key, value.toString());
        }
    }

    body.append('casting_id', casting_id.toString());


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


export async function addRoles(title: string, description: string, job_url: string) {
    logger.info(`in add roles. ${title} ${description} ${job_url}`);
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(job_url, { waitUntil: 'domcontentloaded' });
    const bodyContent = await page.$eval('body', el => el.innerHTML);
    await browser.close();

    try {
        const query = db.selectFrom('castings').selectAll().where('address2', '=', job_url);
        const casting = await query.executeTakeFirst();
        logger.info("Casting: ", JSON.stringify(casting));


        if (!casting) {
            logger.error('Casting not found:', title, job_url);
            return;
        }
        const casting_id = casting.casting_id;
        const casting_sub_timestamp = casting.sub_timestamp;

        const prompt = `
        **You are an expert Casting Director AI.** Your primary function is to analyze job listings and generate a detailed and **de-duplicated** breakdown of casting roles.

        **Your Task:**
        Based on the provided \`Title\`, \`Description\`, and \`Today's Date\`, \`Scraped Job\`, you will identify and create all necessary casting roles. Your main goal is to produce a concise list of **genuinely distinct** roles, avoiding redundancy. Follow the specific instructions below.

        **Input Variables:**
        * \`Title\`: ${title}
        * \`Description\`: ${description}
        * \`Today's Date\`: ${new Date().toISOString()}
        * \`Scraped Job\`: ${bodyContent}
        * \`Submission Timestamp\`: ${casting_sub_timestamp}

        ---

        **Instructions for Generating Roles:**

        1.  **Analyze the Input:** Thoroughly read the \`Title\`, \`Description\`, and \`Scraped Job\` to understand the project type, the overall talent needs, and any specific character types mentioned.
        2.  **Identify and Consolidate Distinct Roles:**
            * Your primary goal is to extract roles that are **fundamentally different** from each other.
            * A "distinct role" is typically defined by a unique combination of:
                * A specific character name or archetype (e.g., "Lead Villain," "Nosy Neighbor," "Real Firefighter," "Upscale Event Guest").
                * A primary age category (see "Age Group Categorization" below).
                * A core function (e.g., Lead, Supporting, Featured, Background/Extra).
            * **CRUCIAL - PREVENT DUPLICATES:**
                * Before defining a new role, check if a very similar role already covers the need.
                * If the \`Description\` or \`Scraped Job\` lists several attributes or slight variations for what is essentially **the same core character type or background need** (e.g., "men 20-30 for cafe scene," "males needed for background, age 25-35," "diner patrons"), **consolidate these into a single, comprehensive role entry.** Combine the descriptions and use the broadest applicable age range if appropriate.
                * Do not create separate entries for minor overlaps in age or rephrasing of the same fundamental requirement. Focus on creating a new role only when it's truly unique from others already identified.
        3.  **Source of Truth:** All role details must be derived directly from the provided \`Description\` or \`Scraped Job\`.
        4.  **Gender Specification:**
            * Create separate role entries for Males and Females **only if the \`Description\` or \`Scraped Job\` clearly specifies distinct needs for each gender within a character type/age group OR if the character type is inherently gendered** (e.g., "King," "Waitress").
            * If gender for a role is generally open or not specified for a broad category (e.g., "Extras," "Children"), use "Any" or "All Genders." You can create separate Male/Female entries if the listing explicitly breaks them down (e.g., "Seeking 10 Male Extras, Seeking 10 Female Extras").
        5.  **Age Group Categorization (Primary Differentiator if Character Type is Broad):**
            * Assign each role to a primary age category. This is a key way to differentiate broad roles if specific character types aren't listed for everyone.
                * **Babies:** (Typically 0-2 years)
                * **Children:** (Typically 3-12 years)
                * **Teens:** (Typically 13-17 years)
                * **Adults:** (Typically 18-60 years)
                * **Senior:** (Typically 60-80 years)
            * Create separate role entries based on these distinct age categories if the description targets them separately (e.g., a call for "Children 6-8" and "Adults 25-40" for the same scene are two distinct age-based role categories).
            * If no age is mentioned, decipher the age from the description or scraped job.
            * EACH ROLE MUST HAVE APPROPRIATE AGE RANGE.
        6.  **Feature Film - Supporting & Extras Default Age:**
            * If the \`Title\` or \`Description\` or \`Scraped Job\` indicates the project is a **"feature film"**:
                * And if the description mentions "supporting" roles or "extras" (or similar terms like "background") **without a specified age range** for them, AND no other specific age-categorized extra roles cover this:
                * Then, create a general extra/supporting role with an age range of **18-80 years** (adjusting from 1-80 to be more common for adult extras unless babies/children are explicitly part of this general call). If the general call clearly includes all ages from babies upwards, then 1-80 is acceptable.
        7.  **Expiration Date Default:**
            * Scan the \`Description\` or \`Scraped Job\` for any mention of an application deadline/ expiration date/ shoot timestamp/ audition date.
            * If **no expiration date is explicitly provided** in the \`Description\` or \`Scraped Job\`, calculate it as **30 days from \`Submission Timestamp\`**. Use UNIX timestamp format.
        8.  **Height Specification:**
            * If height is mentioned for a role, ensure it is represented in **inches**. If a range is given, convert both ends to inches. If not mentioned, state "Not Specified."

        ---

        **Output Format for Each Role:**

        For each **distinct and consolidated** role you identify, structure the information as follows.
        `

        const object = await generateObject({
            model: llm_pro,
            schema: rolesSchema,
            prompt: prompt,
        });

        const llmResponse = object.object as llmResponse;

        const roles = llmResponse.results as Role[];

        logger.info(`Roles: ${JSON.stringify(roles, null, 2)}`);
        // process.exit(0);
        for (const role of roles) {
            await addRoleToET(role, casting_id);
        }
    }
    catch (error) {
        logger.error('Error adding roles:', error)
    }
}
