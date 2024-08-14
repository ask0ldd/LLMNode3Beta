import { AIAgent } from "./AIAgent.js"
import { AIAgenticLibrary } from "./AIAgenticLibrary.js"
import { AIModel } from "./AIModel.js"
import { searchQueryProducerPrompt, useAChunkOfTextToReplyAQuestionPrompt } from "./AIOtherPrompts.js"
import { Browser } from "./Browser.js"

const model = new AIModel({})

const question1 = "What can you tell me about the mexican band hocico?"
const question3 = "What is the name of the singer of the mexican band hocico?"
const question2 = "What are you and what is your role?"

/*
const resp = await model.ask(question1)*/

model.setContext([]).setContextSize(8000).setSystemPrompt(searchQueryProducerPrompt)
.setTemperature(0.3)

const searchQuery = (await JSON.parse((await model.ask(question3)).response.trim()))?.searchQuery // deal with searchQuery missing

console.log(searchQuery)

const searchResults = await Browser.search(searchQuery)
const htmlPageText = []
htmlPageText[0] = await Browser.fetchPage(searchResults[0].url)
htmlPageText[1] = await Browser.fetchPage(searchResults[1].url)
/*htmlPageText[2] = await Browser.fetchPage(searchResults[2].url)
htmlPageText[3] = await Browser.fetchPage(searchResults[3].url)
htmlPageText[4] = await Browser.fetchPage(searchResults[4].url)*/

if(htmlPageText.includes(undefined)) throw new Error()

console.log(JSON.stringify(htmlPageText))

let cleanedupText = await AIAgenticLibrary.textExtractorAgent.resetContext().setRequest(`
${htmlPageText[0]}
`).call()
htmlPageText[0] = cleanedupText

cleanedupText = await AIAgenticLibrary.textExtractorAgent.resetContext().setRequest(`
${htmlPageText[1]}
`).call()
htmlPageText[1] = cleanedupText

model.setContext([]).setContextSize(8000).setSystemPrompt(useAChunkOfTextToReplyAQuestionPrompt)
.setTemperature(0.3)

const summary = await model.ask(
    `Use this chunk of text :\n\n${htmlPageText[0] + '' + htmlPageText[1]}\n\nTo reply this question is :\n\n${question3}\n\n`
)

console.log("\n\n\u001b[1;35m " + summary.response)