import { answersSpectrumExample, technicalLeadershipQuestionsExample } from "./AIPsyPrompts.js";
import { AIPsyTeam } from "./AIPsyTeam.js";

const techLeadPrompt = "Tech Lead in a the company's department dealing with the frontend of a social media plateform"
const DataScientistPrompt = "Data Scientist in charge of analyzing NASDAQ trends"

const jobDisambiguation = await AIPsyTeam.jobExtractorAgent
    .setRequest(techLeadPrompt)
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

const question1 = JSON.parse(rankedQuestions)[0]

const answersSpectrum = await AIPsyTeam.skillAssessmentQuestion_TenAnswersSpectrumProducerAgent
        .setRequest(`Here is the specified position :\n
            ${JSON.parse(jobDisambiguation).jobTitle}\n\n
            Here is the given question :\n
            ${question1}\n\n
            `)
        .call()

const rating = await AIPsyTeam.oneOnOneAnswersComparisonAgent
    .setRequest(
        `Here is the given question :\n
        ${technicalLeadershipQuestionsExample[0]}\n\n
        Here is the reference answer :\n
        ${answersSpectrumExample[5].answer}\n\n
        Here is the candidate answer :\n
        I would recommend performing a thorough code review of the existing codebase. Following this, I'd suggest implementing a contemporary frontend framework, with React or Angular being prime candidates. To improve the overall structure, a modular architecture could be beneficial. For managing styles more effectively, we might consider adopting a CSS-in-JS approach, such as Styled Components.
        `).call()//.loopuntil

const improvementsNeeded = await AIPsyTeam.compareToPerfectAnswerAgent
.setRequest(
    `Here is the given question :\n
    ${technicalLeadershipQuestionsExample[0]}\n\n
    Here is the reference answer :\n
    ${answersSpectrumExample[0].answer}\n\n
    Here is the candidate answer :\n
    I would recommend performing a thorough code review of the existing codebase. Following this, I'd suggest implementing a contemporary frontend framework, with React or Angular being prime candidates. To improve the overall structure, a modular architecture could be beneficial. For managing styles more effectively, we might consider adopting a CSS-in-JS approach, such as Styled Components.
`).call()//.loopuntil








// console.log('\n\n answers spectrum : ' + answersSpectrum)
// console.table(JSON.parse(answersSpectrum))

// console.log(`\n\nrating : ${rating}\nquestion : ${technicalLeadershipQuestionsExample[0]}\nref : ${answersSpectrumExample[0].answer}\ncandidate : I would recommend performing a thorough code review of the existing codebase. Following this, I'd suggest implementing a contemporary frontend framework, with React or Angular being prime candidates. To improve the overall structure, a modular architecture could be beneficial. For managing styles more effectively, we might consider adopting a CSS-in-JS approach, such as Styled Components.\n`)