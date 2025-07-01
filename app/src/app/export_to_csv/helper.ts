import { db } from "../../config/database.js"
import { llm } from "../../config/llm.js"
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
                    .limit(1)
    const data = await query.execute()
    console.log(data)
    return data
}