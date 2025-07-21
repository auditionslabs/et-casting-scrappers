// LLM Config

import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import dotenv from 'dotenv'

// import {
//     GoogleGenAI,
//     createUserContent,
//     createPartFromUri,
//   } from "@google/genai";

dotenv.config()

// export const llmGoogle = google('gemini-2.0-flash')
// export const llmOpenAI = openai(process.env.OPENAI_MODEL || 'gpt-4o')
// const model = process.env.OPENAI_MODEL || 'gpt-4.1'

export const llm = google('gemini-2.5-flash')
export const llm_pro = google('gemini-2.5-pro')


// export async function createCachedLLM(cache: string) {
//     const genai = new GoogleGenAI({apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY})
//     const cachedContext = await genai.caches.create({
//         model: 'gemini-2.0-flash',
//         config: {
//           contents: createUserContent(cache),
//           systemInstruction: "You are an expert analyzing project locations.",
//         },
//       });
    
//       return {genai, cachedContext}

// }
