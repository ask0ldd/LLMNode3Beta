import { AIModel } from "./AIModel.js"
import { search, SafeSearchType } from 'duck-duck-scrape'
import * as cheerio from 'cheerio'

const models = ["llama3", "llama3.1:8b", "dolphin-llama3:8b-256k", "phi3:3.8-mini-128k-instruct-q4_K_M", "qwen2", "qwen2:1.5b", "qwen2:0.5b", "gemma2:9b"]

function splitTextToSequences(text : string, seqLength : number = 200) : Array<string>{
    const words : string[] = text.split(/\s+/)
    let sequences : string[] = []
    let sequence : string[] = []
    for(let i = 0; i < words.length; i++){
        sequence.push(words[i])
        if(i == 0) continue
        if(i % seqLength == 0 || i === words.length - 1){
            sequences.push(sequence.join(" "))
            sequence = []
        }
    }
    return sequences
}

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

model.setModel("llama3.1:8b")
model.setSystemPrompt(`You are a expert linguist.`)
model.setTemperature(0.1)

await model.setContextSize(8000)

model.setContext([])
const resp = await model.ask(`Take the following text, and for each capital caracter, ask yourself if it should lead to a new line. If it does, then add a new line to the text. In the end, output the modified text. Nothing more.\n\n${webpage('main').text().trim()}`) 
console.log("\u001b[1;33m " + resp.response)