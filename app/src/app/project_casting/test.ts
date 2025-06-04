// // import { searchDuplicateProject } from "../helpers/checkDuplicateProject.js"

// import { db } from "../config/database.js";
// import { formatDateToMySQL } from "../utils/dateUtils.js";
// import { searchCD } from "../helpers/searchCD.js";
// // const project_title = "HULU's '9-1-1 Nashville' Casting Call for Stand-Ins"
// // const project_url = "https://projectcasting.com/job/hulus-9-1-1-nashville-casting-call-for-stand-ins"

// // const result = await searchDuplicateProject(project_title, project_url)
// // console.log(result)

// // import { searchCD } from "../helpers/searchCD.js"

// // const company = "Extras Casting Atlanta"
// // const result = await searchCD(company)
// // console.log(result)


import dotenv from "dotenv"
dotenv.config()
import { scrapeListing } from "./scrape_listings.js"
import { CDUser, ScrapedJob } from "@/types/casting.js"
// Remove duplicate import since searchCD is already imported above
import { searchCD } from "../../helpers/searchCD.js"

const scrappedJob: ScrapedJob = JSON.parse('{\"title\":\"$4,600+ Casting Call – Outdoor Enthusiasts (Ages 20 to 50)\",\"company_name\":\"Kris and Kara Casting\",\"job_url\":\"https://projectcasting.com/job/4600-casting-call-outdoor-enthusiasts-ages-20-to-50\",\"date_posted\":\"June 2, 2025\",\"job_description\":[\"Job Description\",\"A national commercial campaign is casting real outdoor enthusiasts in Vancouver, BC! We’re looking for energetic individuals aged 20–50 who love adventure and thrive in nature. This is a non-union commercial shoot—no acting experience is needed, just a genuine passion for the outdoors. If you can hike uphill, run through mud, or ride the waves, this could be your next big gig.\",\"Job Responsibilities\",\"• Participate in action-based scenes such as hiking, biking, fishing, or snow sports\",\"• Navigate uneven outdoor terrain with confidence and enthusiasm\",\"• Follow basic on-set direction from production crew\",\"• Represent authentic outdoor lifestyles on screen\",\"Requirements\",\"• Ages 20–50, all genders and ethnicities welcome\",\"• Must be based in or able to work as a local in Vancouver\",\"• Physically fit and comfortable performing outdoor activities\",\"• Open to those experienced in hiking, climbing, surfing, skiing, biking, camping, or fishing\",\"• No prior acting experience required\",\"Compensation\",\"• $600 per day\",\"• Additional $4,000 one-year buyout (if featured in final edit)\",\"• Potential conflict: automobile sales & leasing (cars, trucks, SUVs)\"],\"union_job\":false,\"compensation\":\"Paid\",\"rate\":4600,\"company_url\":\"https://projectcasting.com/company/kris-and-kara-casting\"}')
const user = await searchCD(scrappedJob.company_name)
console.log(user)
const data = await scrapeListing(scrappedJob, user as CDUser)
console.log(JSON.stringify(data, null, 2))


// const listing1 = {
//     "title": "“How To Rob a Bank” Casting Call for Stand-In 2",
//     "location": "Pittsburgh, Pennsylvania",
//     "type": "Actor",
//     "skills": "Acting",
//     "company_name": "Movie Casting PGH",
//     "body_type": "Petite or small frame",
//     "gender": "Female",
//     "age": "20s to 30s",
//     "height": "5'0\" to 5'3\"",
//     "ethnicity": "African American / Black",
//     "union_job": false,
//     "rate": 265,
//     "expiration_date": "06-30-2025",
//     "category": "Feature Film - Inde/Low Budget",
//     "compensation": "Paid",
//     "date_posted": "2025-05-30T09:42:03-04:00",
//     "description": "Stand-In Actor Needed: Female, 20s–30s, Petite Build (AA/Black)\nJob Description\nA film production is casting a stand-in for a female actor to support technical setup and rehearsal processes. This is a vital behind-the-scenes role requiring availability across the full production window. Applicants must match the physical profile and demonstrate reliability on set.\nIn addition to stand-in roles, paid background extras are now being cast for How to Rob a Bank, a new Amazon MGM Studios film directed by David Leitch (Deadpool 2, Hobbs & Shaw, Bullet Train), filming in the Pittsburgh area. The cast includes Pete Davidson, Zoë Kravitz, Nicholas Hoult, Anna Sawai, and Rhenzy Feliz.\nBackground actors of all ages are needed to portray sports fans, law enforcement officers, diner patrons, and more. No prior experience is necessary. Casting is looking for people available for either one or multiple days between mid-June and August.\nJob Responsibilities\nStand in for lead actor during lighting and camera configurations\nReplicate actor's movements and positions for technical adjustments\nCollaborate with camera, lighting, and production teams\nMaintain a consistent presence and professional attitude\nRequirements\nFemale, aged 20s to 30s\nAfrican American / Black\nHeight: 5'0\" to 5'3\"\nPetite or small frame\nMust be available for camera tests on June 4th and 5th\nFull availability from June 16th to August 14th\nCompensation\nRate: $265 for 12-hour day",
//     "updated_title": "How To Rob a Bank Casting Call for Stand-In 2",
//     "project_quality": 6,
//     "job_url": "https://projectcasting.com/job/how-to-rob-a-bank-casting-call-for-stand-in-2",
//     "updated_description": "Stand-In Actor Needed: Female, 20s–30s, Petite Build (AA/Black). A film production is casting a stand-in for a female actor to support technical setup and rehearsal processes. This is a vital behind-the-scenes role requiring availability across the full production window. Applicants must match the physical profile and demonstrate reliability on set. In addition to stand-in roles, paid background extras are now being cast for How to Rob a Bank, a new Amazon MGM Studios film directed by David Leitch (Deadpool 2, Hobbs & Shaw, Bullet Train). The cast includes Pete Davidson, Zoë Kravitz, Nicholas Hoult, Anna Sawai, and Rhenzy Feliz. Background actors of all ages are needed to portray sports fans, law enforcement officers, diner patrons, and more. No prior experience is necessary. Casting is looking for people available for either one or multiple days between mid-June and August. Job Responsibilities: Stand in for lead actor during lighting and camera configurations, Replicate actor's movements and positions for technical adjustments, Collaborate with camera, lighting, and production teams, Maintain a consistent presence and professional attitude. Requirements: Female, aged 20s to 30s, African American / Black, Height: 5'0\" to 5'3\", Petite or small frame, Must be available for camera tests on June 4th and 5th, Full availability from June 16th to August 14th.",
//     "rate_des": "day"
// }

// const listing2 = {
//     "title": "“How To Rob a Bank” Casting Call for Stand-In 3",
//     "location": "United States",
//     "type": "TV & Video",
//     "skills": "Acting",
//     "company_name": "Movie Casting PGH",
//     "body_type": "Petite or small build",
//     "gender": "Female",
//     "age": "20s to 30s",
//     "height": "5'0\" to 5'3\"",
//     "ethnicity": "Asian",
//     "union_job": false,
//     "rate": 265,
//     "expiration_date": "06-30-2025",
//     "category": "Feature Film - Inde/Low Budget",
//     "compensation": "Paid",
//     "date_posted": "May 30, 2025",
//     "description": "Stand-In Actor Needed: Female, 20s–30s, Petite Build (Asian)\nJob Description\nA dynamic production is looking for a reliable female stand-in to assist with key behind-the-scenes operations. This role supports the camera and lighting teams by mirroring the lead actor's movements and physical presence during technical setup. Full availability across the production period is required.\nIn addition to stand-in roles, paid background extras are now being cast for How to Rob a Bank, a new Amazon MGM Studios film directed by David Leitch (Deadpool 2, Hobbs & Shaw, Bullet Train), filming in the Pittsburgh area. The cast includes Pete Davidson, Zoë Kravitz, Nicholas Hoult, Anna Sawai, and Rhenzy Feliz.\nBackground actors of all ages are needed to portray sports fans, law enforcement officers, diner patrons, and more. No prior experience is necessary. Casting is looking for people available for either one or multiple days between mid-June and August.\nJob Responsibilities\nServe as a stand-in during lighting and camera setup\nMimic principal actor's movements and marks to ensure shot consistency\nCollaborate with cinematography and production teams\nDemonstrate punctuality and professionalism on set\nRequirements\nFemale, aged 20s to 30s\nAsian\nHeight: 5'0\" to 5'3\"\nPetite or small build\nMust be available for camera tests on June 4th and 5th\nFull availability from June 17th to August 14th\nCompensation\nRate: $265 for 12-hour day",
//     "updated_title": "Casting Call for Stand-In 3 in How To Rob a Bank",
//     "project_quality": 6,
//     "job_url": "https://projectcasting.com/job/how-to-rob-a-bank-casting-call-for-stand-in-3",
//     "updated_description": "Stand-In Actor Needed: Female, 20s–30s, Petite Build (Asian). A dynamic production is looking for a reliable female stand-in to assist with key behind-the-scenes operations. This role supports the camera and lighting teams by mirroring the lead actor's movements and physical presence during technical setup. Full availability across the production period is required. In addition to stand-in roles, paid background extras are now being cast for How to Rob a Bank, a new Amazon MGM Studios film directed by David Leitch (Deadpool 2, Hobbs & Shaw, Bullet Train). The cast includes Pete Davidson, Zoë Kravitz, Nicholas Hoult, Anna Sawai, and Rhenzy Feliz. Background actors of all ages are needed to portray sports fans, law enforcement officers, diner patrons, and more. No prior experience is necessary. Casting is looking for people available for either one or multiple days between mid-June and August. Job Responsibilities: Serve as a stand-in during lighting and camera setup, Mimic principal actor's movements and marks to ensure shot consistency, Collaborate with cinematography and production teams, Demonstrate punctuality and professionalism on set. Requirements: Female, aged 20s to 30s, Asian, Height: 5'0\" to 5'3\", Petite or small build, Must be available for camera tests on June 4th and 5th, Full availability from June 17th to August 14th.",
//     "rate_des": "day"
// }

// const result = await addProjectApps(listing1)
// console.log(result)


// const casting_ids = [1672482]

// const currentDate = formatDateToMySQL(new Date());
// for (const casting_id of casting_ids) {
//     try {
//         await db.insertInto('laret_casting_apps').values([{
//             casting_id: casting_id,
//             app_id: 1,
//             created_at: currentDate,
//             updated_at: currentDate,
//         }, {
//             casting_id: casting_id,
//             app_id: 4,
//             created_at: currentDate,
//             updated_at: currentDate,
//         }]).execute();
//     } catch (error) {
//         console.log(error)
//     }
// }

// const company = "Movie Casting ahdfsdf"
// const result = await searchCD(company)
// console.log(result)

process.exit(0);