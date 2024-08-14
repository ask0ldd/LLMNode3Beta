import { AIAgent } from "./AIAgent.js"
import { AIAgenticLibrary } from "./AIAgenticLibrary.js"
import { AIModel } from "./AIModel.js"
import { searchQueryProducerPrompt, useAChunkOfTextToReplyAQuestionPrompt } from "./AIOtherPrompts.js"
import { Browser } from "./Browser.js"

const model = new AIModel({})

const question1 = "What can you tell me about the mexican band hocico?"
const question3 = "What is the name of the singer of the mexican band hocico?"
const question2 = "What are you and what is your role?"

/*model.setContext([]).setSystemPrompt("You are an helpful assistant. Your answers should be precise and make the best usage of your knowledge and your reasoning abilities.")
.setContextSize(8000)

const resp = await model.ask(question1)*/

/*model.setContext([]).setContextSize(8000).setSystemPrompt(`You are a SEO specialist and as such, you are an expert at using search engines. 
    This means : You know exactly how to produce the best keywords needed for a search engines to give you the best search results possible. \n\n
    Your role is : \n
    - To ignore the given question and your impulse to reply to it.
    - To take the given question and instead write out of it a sequence of keywords that gives you the best chance to find an answer.\n
    - To reply ONLY with this produced sequence of keywords.\n
    - NOT to reply to the given question, you only have to produce the requested sequence of keywords.\n
    - NOT to add any commentary to your output.\n
    - NOT to add any annotation to your output.\n
    - NOT to add any marking to your output.\n
    Here follows the given question : \n\n`)
.setTemperature(0.1)*/

model.setContext([]).setContextSize(8000).setSystemPrompt(searchQueryProducerPrompt)
.setTemperature(0.3)

const searchQuery = (await JSON.parse((await model.ask(question3)).response.trim()))?.searchQuery // deal with searchQuery missing

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
${question3}\n\n
`)

console.log("\n\n\u001b[1;35m " + summary.response)