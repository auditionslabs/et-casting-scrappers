// import { searchDuplicateProject } from "../helpers/checkDuplicateProject.js"

// const project_title = "Background Role in abcdeddewfg"

// const result = await searchDuplicateProject(project_title)
// console.log(result)

import { searchCD } from "../helpers/searchCD.js"

const company = "The Casting Company"
const result = await searchCD(company)
console.log(result)
