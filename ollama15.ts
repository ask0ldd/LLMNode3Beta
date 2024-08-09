import { AIModel } from "./AIModel.js"
import { search, SafeSearchType } from 'duck-duck-scrape'
import * as cheerio from 'cheerio'
import { AIAgent } from "./AIAgent.js"

const models = ["llama3", "llama3.1:8b", "dolphin-llama3:8b-256k", "phi3:3.8-mini-128k-instruct-q4_K_M", "qwen2", "qwen2:1.5b", "qwen2:0.5b", "gemma2:9b"]

const model = new AIModel({})

// You are an helpful assistant. Your reply should always follow the json schema given by the user. No need for any commentary or explaination. Calculate the result value of all formulas.

/*
model.setModel("llama3.1:8b")
model.setSystemPrompt(`You are a revered story teller, as great as lovecraft or edgar alan poe.`)
model.setTemperature(0.1)

await model.setContextSize(8000)

model.setContext([])
const resp = await model.ask(`Write for me a short story where, in the future, people leaves in such small appartments that they need to get a virtual reality subscription and a headset to escape the induced claustrophobia. View this as the final step of the exploitation of mankind.`) 
console.log("\u001b[1;33m " + resp.response)
*/

const searchResults = await search('node.js', {
    safeSearch: SafeSearchType.STRICT
})

console.log(searchResults)

let url = searchResults.results[0].url
console.log('url : ', url)
let html = ""

try {
    const response = await fetch(url);
    if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
    }
    html = await response.text()
}catch(error){
    console.log(error)
}

// console.log('html : ', html)

const webpage = cheerio.load(html)

console.log('main : ', webpage('main').text())

/*model.setModel("llama3.1:8b").setSystemPrompt(`You are a expert linguist.`).setTemperature(0.1)

await model.setContextSize(8000)

model.setContext([])
const resp = await model.ask(`Take the following text, and for each capital caracter, ask yourself if it should lead to a new line. If it does, then add a new line to the text. In the end, output the modified text. Nothing more.\n\n${webpage('main').text().trim()}`) 
console.log("\u001b[1;33m " + resp.response)

model.setSystemPrompt(`You are a chief editor for a scientific paper and developper.`).setTemperature(0.3).setContext([])

const resp2 = await model.ask(`Extract only the code from the following text with no added annotations or delimiters :\n\n${resp.response}`)
console.log("\u001b[1;34m " + resp2.response)

const resp3 = await model.ask("what are you?")
console.log("\u001b[1;35m " + resp3.response)*/

const agent = new AIAgent("Line Formater Agent").setSystemPrompt("You are a expert linguist. When a text is sent to you, you should format it in the following way. For each capital letter, ask yourself if this letter is a marker for a new line. If it is, then add a new line to the original text. Don't try to be creative. Just follow this simple process and in the end, output the modified text. Nothing more than the formatted text. Here comes the text to format : \n\n")

agent.setRequest(`${webpage('main').text().trim()}`)
let result = await agent.call()

const agent2 = new AIAgent("Code Extracter Agent").setSystemPrompt("You are an expert developper and such it is easy for you to spot any code. You can recognize any programming langage. When a text is sent to you, you should extract the code out of it and output it as it is, with no annotations or delimiters added. Here comes the text to format : \n\n")

if(result) agent2.setRequest(result)
result = await agent2.call()