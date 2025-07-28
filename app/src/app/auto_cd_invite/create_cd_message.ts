import logger from '../../config/logger.js';
import { llm } from '../../config/llm.js';
import { z } from 'zod';
import { generateObject } from 'ai';



export async function createCDMessage(role: any, project: any) {   
    const prompt = `
    You are a casting director. You are given a role and a project.
    You need to create an invite message to send to the talents on the exploretalent platform.
    The message should be inviting and should get the talents excited about the project.
    DO NOT INCLUDE THE RATE IN THE MESSAGE UNLESS IT IS ABOVE 500/ event.
    *** Project ***
    ${JSON.stringify(project)}
    *** Role ***
    ${JSON.stringify(role)}
    `
    const schema = z.object({
        message: z.string(),
    })
    const { object } = await generateObject({
        model: llm,
        schema,
        prompt,
    })
    console.log(object);
    return object.message;
}