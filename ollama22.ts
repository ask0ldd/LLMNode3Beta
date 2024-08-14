import { AIAgent } from "./AIAgent.js"
import { AIAgenticLibrary } from "./AIAgenticLibrary.js"
import { AIModel } from "./AIModel.js"
import { searchQueryProducerPrompt, useAChunkOfTextToReplyAQuestionPrompt } from "./AIOtherPrompts.js"
import { Browser } from "./Browser.js"

const model = new AIModel({})

const question1 = "Which is the most known track of the band Agonoize?"

/*model.setContext([]).setSystemPrompt("You are an helpful assistant. Your answers should be precise and make the best usage of your knowledge and your reasoning abilities.")
.setContextSize(8000)

const resp = await model.ask(question1)*/

model.setContext([]).setContextSize(8000).setSystemPrompt(searchQueryProducerPrompt)
.setTemperature(0.3)

const searchQuery = (await JSON.parse((await model.ask(question1)).response.trim()))?.searchQuery // deal with searchQuery missing

console.log(searchQuery)

const searchResults = await Browser.search(searchQuery)
const htmlPageText = []
htmlPageText[0] = await Browser.fetchPage(searchResults[0].url)
/*htmlPageText[1] = await Browser.fetchPage(searchResults[1].url)
htmlPageText[2] = await Browser.fetchPage(searchResults[2].url)
htmlPageText[3] = await Browser.fetchPage(searchResults[3].url)
htmlPageText[4] = await Browser.fetchPage(searchResults[4].url)*/

if(htmlPageText.includes(undefined)) throw new Error()

console.log(JSON.stringify(htmlPageText))

const cleanedupText = await AIAgenticLibrary.textExtractorAgent.resetContext().setRequest(`
${htmlPageText[0]}
`).call()

model.setContext([]).setContextSize(8000).setSystemPrompt(useAChunkOfTextToReplyAQuestionPrompt)
.setTemperature(0.3)

const summary = await model.ask(`
Use this chunk of text :\n\n
${cleanedupText}\n\n
To reply this question is :\n\n
${question1}\n\n
`)

console.log("\n\n\u001b[1;35m " + summary.response)