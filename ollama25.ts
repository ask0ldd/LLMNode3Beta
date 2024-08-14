import { AIAgent } from "./AIAgent.js"
import { AIAgenticLibrary } from "./AIAgenticLibrary.js"
import { AIModel } from "./AIModel.js"
import { useAChunkOfTextToReplyAQuestionPrompt } from "./AIOtherPrompts.js"
import { Browser } from "./Browser.js"

const model = new AIModel({})

const question1 = "Which actor played the role of Corlys Velaryon into the tv show 'house of the dragon'?"

/*model.setContext([]).setSystemPrompt("You are an helpful assistant. Your answers should be precise and make the best usage of your knowledge and your reasoning abilities.")
.setContextSize(8000)

const resp = await model.ask(question1)*/

const searchQueryObject = await AIAgenticLibrary.searchQueryProducerAgent
    .resetContext()
    .setRequest(question1)
    .call()

const searchQuery = (await JSON.parse(searchQueryObject.trim()))?.searchQuery // deal with searchQuery missing

console.log("search query : " + searchQuery)

const searchResults = await Browser.search(searchQuery)
const htmlPageText = []
htmlPageText[0] = await Browser.fetchPage(searchResults[0].url)
console.log(searchResults[0].url)
/*htmlPageText[1] = await Browser.fetchPage(searchResults[1].url)
htmlPageText[2] = await Browser.fetchPage(searchResults[2].url)
htmlPageText[3] = await Browser.fetchPage(searchResults[3].url)
htmlPageText[4] = await Browser.fetchPage(searchResults[4].url)*/

if(htmlPageText.includes(undefined)) throw new Error()

console.log(JSON.stringify(htmlPageText))

const cleanedupText = await AIAgenticLibrary.textExtractorAgent.resetContext().setRequest(`
${htmlPageText[0]}
`).call()

model.setContext([])
    .setContextSize(8000)
    .setSystemPrompt(useAChunkOfTextToReplyAQuestionPrompt)
    .setTemperature(0.3)

const summary = await model.ask(`
The chunk of text that needs to be used :\n
${cleanedupText}\n\n
The question i need an answer for :\n
${question1}\n\n
`)

console.log("\n\n\u001b[1;35m" + summary.response)