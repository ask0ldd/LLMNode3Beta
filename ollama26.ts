import { AIPsyTeam } from "./AIPsyTeam.js";

const techLeadPrompt = "Tech Lead in a the company's department dealing with the frontend of a social media plateform"
const DataScientist = "Data Scientist in charge of analyzing NASDAQ trends"

const jobDisambiguation = await AIPsyTeam.jobExtractorAgent
    .setRequest(DataScientist)
    .call()

console.log('\n\n job title : ' + JSON.parse(jobDisambiguation).jobTitle)

// !!! should chat to ask rh a description of the position instead of it being hardcoded
const requiredSkillset = await AIPsyTeam.requiredSkillsetGeneratorAgent
    .setRequest(jobDisambiguation)
    .call()

console.log('\n\n skillset : ' + requiredSkillset)

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
    Here is THE ONE AND ONLY targeted skill your questions should assess :\n
    ${skill1}`)
    .call()

console.log('\n\n questions : ' + questionsAssessingSkill)

const rankedQuestions = await AIPsyTeam.skillAssessmentQuestionsRankingAgent
    .setRequest(`Here is a javascript array containing the list of questions :\n
    ${questionsAssessingSkill}\n\n
    Here is the targeted skill assessed by those questions :\n
    ${skill1}`)
    .call()

console.log('\n\n ranked questions : ' + rankedQuestions)