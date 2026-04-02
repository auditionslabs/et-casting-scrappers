import { MappedJob } from "@/types/casting";
import logger from "../config/logger.js";


export async function addProjectToET(mappedJob: MappedJob) {
	try {
		if (!process.env.EXPLORE_TALENT_API_KEY) {
			logger.error('EXPLORE_TALENT_API_KEY is missing; cannot POST /v1/admin/projects.');
			return { success: false as const, error: new Error('EXPLORE_TALENT_API_KEY missing') };
		}
		const headers = {
			"accept": "*/*",
			"accept-language": "en-IN,en;q=0.6",
			"authorization": `Bearer ${process.env.EXPLORE_TALENT_API_KEY}`,
			"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			"sec-ch-ua": "\"Chromium\";v=\"136\", \"Brave\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"ET-SCRAPPER-API"',
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-site",
			"sec-gpc": "1"
		}
		const body = new URLSearchParams()
		for (const key in mappedJob) {
			body.append(key, String(mappedJob[key]))
		}

		const response = await fetch("https://api.exploretalent.com/v1/admin/projects", {
			method: "POST",
			headers: headers,
			body: body.toString()
		});

		

		await new Promise(resolve => setTimeout(resolve, 500));

		const errorBody = await response.text();

		if (!response.ok) {
			logger.error(
				`Error adding project to Explore Talent: status=${response.status} ${response.statusText} body=${errorBody.slice(0, 4000)}`
			);
			throw new Error(`HTTP ${response.status}: ${errorBody.slice(0, 500)}`);
		}

		let result: unknown = {};
		if (errorBody.trim()) {
			try {
				result = JSON.parse(errorBody) as unknown;
			} catch {
				logger.warn('Explore Talent projects response was not JSON:', errorBody.slice(0, 500));
			}
		}
		logger.info("Project Added to Explore Talent:" + JSON.stringify(result, null, 2))

		return result;
	} catch (error) {
		
		logger.error('Error adding project to Explore Talent:', JSON.stringify(error),
		"\nListing: ", JSON.stringify(mappedJob));
		return {
			success: false,
			error: error
		}

	}

	
}