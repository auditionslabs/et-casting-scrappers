// LLM Config

import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import dotenv from 'dotenv'
dotenv.config()

// export const llmGoogle = google('gemini-2.0-flash')
// export const llmOpenAI = openai(process.env.OPENAI_MODEL || 'gpt-4o')
// const model = process.env.OPENAI_MODEL || 'gpt-4.1'

export const llm = google('gemini-2.0-flash')
// export const llm = openai(model);