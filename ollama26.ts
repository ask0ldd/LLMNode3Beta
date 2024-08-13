import { AIPsyTeam } from "./AIPsyTeam.js";

const jobDisambiguation = await AIPsyTeam.jobExtractorAgent
    .setRequest("Tech Lead in a the company's department dealing with the frontend of a social media plateform")
    .call()

console.log('\n\n' + JSON.parse(jobDisambiguation).jobTitle)

// !!! should chat to ask rh a description of the position instead of it being hardcoded
const requiredSkillset = await AIPsyTeam.requiredSkillsetGeneratorAgent
    .setRequest(jobDisambiguation)
    .call()

console.log('\n\n' + requiredSkillset)

// const skillsetAssessmentQuestions : {name : string, description : string, questions : string[]}[] = []

/*skillset.forEach(async (skill : {name : string, description : string}) => {
    const questionAssessingSkill = await AIPsyTeam.skillToQuestionsTranslatorAgent
    .setRequest(skill.description)
    .call()
})*/

/*let skillIndex = 0
for (const skill of skillset) {
    const questionsAssessingSkill = await AIPsyTeam.skillToQuestionsTranslatorAgent
    .setRequest(skill.description)
    .call()
}*/

// !!! should add dark triad assessment

const skillset = JSON.parse(requiredSkillset)
const skill1 = skillset[0].description
const questionsAssessingSkill = await AIPsyTeam.skillToQuestionsTranslatorAgent
    .setRequest(`Here is the specified position :\n
    ${JSON.parse(jobDisambiguation).jobTitle}\n\n
    Here is the given skill :\n
    ${skill1.description}`)
    .call()

console.log('\n\n' + questionsAssessingSkill)
