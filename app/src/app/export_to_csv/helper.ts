import { db } from "@/config/database"
import { llm } from "@/config/llm"
import { generateText } from "ai"

export async function summerizeDescription(description: string, roles_json: string) {
    const response = await generateText({
        model: llm,
        prompt: `Summarize the following description: ${description} in a max of 50 words. Return only the summary, no other text. All the roles are: ${roles_json}`,
    })
    return response.text
}

export async function getRoles(casting_id: number) {
    const query = db.selectFrom('roles as r')
                    .selectAll()
                    .where('casting_id', '=', casting_id)
    const data = await query.execute()
    return data
}