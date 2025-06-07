import { llm } from "../config/llm.js";
import { generateObject } from "ai";
import { z } from "zod";
import logger from "../config/logger.js";

export type UpdatedNameDescriptionProjectQuality = {
    name: string,
    description: string,
    project_quality: number,
}

export async function getUpdatedNameAndDescription(original_name: string, description: string[]): Promise<UpdatedNameDescriptionProjectQuality> {
    try {
        const { object } = await generateObject({
            model: llm,
            schema: z.object({
                description: z.string(),
                project_quality: z.number(),
                name: z.string(),
                
        }),
        prompt: `You are an expert content editor and casting analyst. Your task is to process a raw casting call listing, rewrite it into a clean and search-engine-optimized (SEO) format, and provide a detailed quality rating based on its contents.

        Analyze the provided \`original_name\` and \`description\` to identify all key details, then follow the instructions below.

        ---

        ### **Instructions:**

        #### **1. Create an SEO-Friendly Title:**
        - From the \`original_name\`, create a new, concise, and compelling title.
        - The title must be SEO-friendly, focusing on the project type, brand, or name of the production. (e.g., "Casting for Nike Commercial" or "Lead Roles for Indie Film 'Starlight'").
        - **Rule:** The word "Open" must be removed from the final title.
        - **Rule:** The title should not be excessively long.

        #### **2. Rewrite the SEO-Friendly Description:**
        - From the \`description\`, write a new descriptive paragraph about the project.
        - The description must be SEO-friendly. Focus on the core project details that would attract talent, such as the story, the brand's prestige, the director's vision, or the production's style. Use relevant keywords naturally (e.g., "sci-fi feature film," "major streaming service," "lifestyle brand photoshoot").
        - **Rule:** Ensure the full text is present and does not use ellipses (\`...\`) or other truncation symbols.
        - **Rule:** The following information **must be removed** from the final description text:
            - Any mention of a generalized location (e.g., "tri-state area," "nationwide").
            - Any mention of the pay, compensation, or the word "rate."
            - All contact information (emails, phone numbers, websites to apply).
            - The specific list of roles being cast.
            - The list of requirements for any roles (e.g., "must be 5'10"," "must speak Spanish").

        #### **3. Rate the Project Quality:**
        - Analyze the original \`description\` to assess the caliber of the project based on pay, talent, brand involvement, project type, and clarity.
        - Assign a **Project Quality Rating** on a scale of 1-6 using this specific rubric:
            - 6 - Top Tier Project: Involves an A-list celebrity or a major global brand (e.g., Nike, Apple, Coca-Cola, Netflix, HBO). Pay is very high (explicitly $1000+). Project is a studio feature film or major commercial. Highly marketable.
            - 5 - High-Quality Project: Involves a recognizable (but not A-list) brand or celebrity. Pay is strong and professional (explicitly $500+). Production is professional (commercial, TV show, feature film) with solid exposure potential.
            - 4 - Standard Professional Project: A standard industry production like a music video, television episode, or web series. Pay is moderate to low, but clearly stated. May be union or non-union. Has some brand or production credibility.
            - 3 - Mid-Level Indie Project: A student film, theater production, or low-budget short film. Pay is a small stipend, deferred, or unpaid (copy/credit/meal). No major talent or brand is attached. Primary value is artistic or for a reel.
            - 2 - Basic/Entry-Level Gig: Explicitly for background roles or extra work. No notable cast or production company mentioned. Compensation is unpaid or a very small token amount. Offers little to no portfolio visibility.
            - 1 - Low Quality / Poorly Described: The project description has very little information. Pay is not mentioned or terms are extremely unclear/suspicious. Lacks casting details, brand info, or any sign of production value. Could be a non-legitimate or very low-effort post.

        ---

        ### **Input Variables:**

        - \`original_name\`: ${original_name}
        - \`description\`: ${description}

        ### **Required Output Format:**

        Present your final response in Markdown format exactly as follows:

        **Title:** [Your rewritten SEO-friendly title]

        **Description:** [Your rewritten SEO-friendly description]

        **Project Quality Rating:** [Your rating of 1-6]`,
    })
    return {name: object.name, description: object.description, project_quality: object.project_quality};
    }
    catch (error) {
        logger.error('Error getting updated name and description:', error)
        return {name: original_name, description: description.join('\n'), project_quality: 1};
    }
}

