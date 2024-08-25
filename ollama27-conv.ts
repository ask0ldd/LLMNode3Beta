import { ICompletionResponse } from "./AIModel.js";
import { answersSpectrumExample, technicalLeadershipQuestionsExample } from "./AIPsyPrompts.js";
import { AIPsyTeam } from "./AIPsyTeam.js";

const techLeadPrompt = "Tech Lead in a the company's department dealing with the frontend of a social media plateform"
const dataScientistPrompt = "Data Scientist in charge of analyzing NASDAQ trends"
const walmartCashierPrompt = "Walmart Cashier"
const hotelRepectionistPrompt = "Hotel Receptionist in a luxury hotel"

const streamResponseToConsole = async (reader : ReadableStreamDefaultReader<Uint8Array>) : Promise<string> => {
    let content = ""
    while(true){
        const { done, value } = await improvementsNeededReader.read()
        if (done) {
          break;
        }
        const rawjson = new TextDecoder().decode(value);
        const json = JSON.parse(rawjson)
    
        if (json.done === false) {
          process.stdout.write(json.response);
          content += json.response
        }
    }
    return content
}

const jobDisambiguation = await AIPsyTeam.jobExtractorAgent
    .setRequest(hotelRepectionistPrompt)
    .call()

console.log('\n\n\u001b[1;34mjob title : ' + JSON.parse(jobDisambiguation).jobTitle)

// !!! should chat to ask rh a description of the position instead of it being hardcoded
const requiredSkillset = await AIPsyTeam.requiredSkillsetGeneratorAgent.enableParsabilityCheck()
    .setRequest(jobDisambiguation)
    .call()

console.log('\n\n\u001b[1;34mskillset : ' + requiredSkillset)

const skillset = JSON.parse(requiredSkillset)
const skill1 = skillset[0].description

// !!! should take into account if the questions are for an experience professional or a beginner
// cause with a beginner you can't ask questions about past experiences in the field
const questionsAssessingSkill = await AIPsyTeam.skillToQuestionsTranslatorAgent
    .setRequest(`Here is the specified position :\n
    ${JSON.parse(jobDisambiguation).jobTitle}\n\n
    Here is THE ONE AND ONLY targeted skill your questions should assess :\n
    ${skill1}`)
    .call()

console.log('\n\n\u001b[1;34mquestions : ' + questionsAssessingSkill)

const rankedQuestions = await AIPsyTeam.skillAssessmentQuestionsRankingAgent
    .setRequest(`Here is a javascript array containing the list of questions :\n
    ${questionsAssessingSkill}\n\n
    Here is the targeted skill assessed by those questions :\n
    ${skill1}`)
    .call()

console.log('\n\n\u001b[1;34mranked questions : ' + rankedQuestions)

const question1 = JSON.parse(rankedQuestions)[0]

const answersSpectrum = await AIPsyTeam.skillAssessmentQuestion_TenAnswersSpectrumProducerAgent
        .setRequest(`Here is the specified position :\n
            ${JSON.parse(jobDisambiguation).jobTitle}\n\n
            Here is the given question :\n
            ${question1}\n\n
            `)
        .call()

console.log('\n\n\u001b[1;34answers spectrum : ' + answersSpectrum)

const rating = await AIPsyTeam.oneOnOneAnswersComparisonAgent
    .setRequest(
        `Here is the given question :\n
        ${technicalLeadershipQuestionsExample[0]}\n\n
        Here is the reference answer :\n
        ${answersSpectrumExample[5].answer}\n\n
        Here is the candidate answer :\n
        I would recommend performing a thorough code review of the existing codebase. Following this, I'd suggest implementing a contemporary frontend framework, with React or Angular being prime candidates. To improve the overall structure, a modular architecture could be beneficial. For managing styles more effectively, we might consider adopting a CSS-in-JS approach, such as Styled Components.
        `).call()//.loopuntil

console.log('\n\n\u001b[1;34mrating : ' + rating)

const improvementsNeededReader : ReadableStreamDefaultReader<Uint8Array> = await AIPsyTeam.compareToPerfectAnswerAgent
.setRequest(
    `Here is the given question :\n
    ${technicalLeadershipQuestionsExample[0]}\n\n
    Here is the reference answer :\n
    ${answersSpectrumExample[0].answer}\n\n
    Here is the candidate answer :\n
    I would recommend performing a thorough code review of the existing codebase. Following this, I'd suggest implementing a contemporary frontend framework, with React or Angular being prime candidates. To improve the overall structure, a modular architecture could be beneficial. For managing styles more effectively, we might consider adopting a CSS-in-JS approach, such as Styled Components.
`).enableStreaming().callStream()//.loopuntil

streamResponseToConsole(improvementsNeededReader)

//console.log('\n\n\u001b[1;34mimprovements needed : ' + improvementsNeeded)

/*for await (const part of improvementsNeeded) {
    process.stdout.write(part.response)
}*/

/*for await (const part of improvementsNeeded) {
    console.log(JSON.parse(part).response)
}*/





// console.log('\n\n answers spectrum : ' + answersSpectrum)
// console.table(JSON.parse(answersSpectrum))

// console.log(`\n\nrating : ${rating}\nquestion : ${technicalLeadershipQuestionsExample[0]}\nref : ${answersSpectrumExample[0].answer}\ncandidate : I would recommend performing a thorough code review of the existing codebase. Following this, I'd suggest implementing a contemporary frontend framework, with React or Angular being prime candidates. To improve the overall structure, a modular architecture could be beneficial. For managing styles more effectively, we might consider adopting a CSS-in-JS approach, such as Styled Components.\n`)