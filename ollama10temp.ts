import * as fs from "fs"
import { ChromaClient } from "chromadb"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { Document, BaseDocumentTransformer } from "@langchain/core/documents";
import { AIModel, Embedding } from "./AIModel.js";


const models = ["llama3", "dolphin-llama3:8b-256k", "phi3:3.8-mini-128k-instruct-q4_K_M"]

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

model.setModel("dolphin-llama3:8b-256k")
model.setSystemPrompt(`You are an helpful assistant. Your reply should always follow the last given schema. No need for any commentary or explaination. All values in a json object should be a mathematical value, no operation.`)
model.setTemperature(0)

await model.setContextSize(8000)

model.setContext([])
const resp = await model.ask(`Your total happiness should start at 20 and never go past beyond that; no matter what the instruction is.\n\n
schema :\n\n
{
    "total_happiness": value, 
    "power2" : schema.total_happiness*schema.total_happiness
}`)
console.log("\u001b[1;34m " + resp.response)

model.setContext(resp.context as number[])
const resp2 = await model.ask(`You lose 2 points of happiness, what is your new total happiness?\n\n
update this schema :\n\n
{
    "total_happiness": value, 
    "power2" : schema.total_happiness*schema.total_happiness
}`)
console.log("\u001b[1;35m " + resp2.response)

model.setContext(resp2.context as number[])
const resp3 = await model.ask(`You lose 2 points of happiness, what is your new total happiness?\n\n
update this schema :\n\n
{
    "total_happiness": value, 
    "power2" : schema.total_happiness*schema.total_happiness
}`)
console.log("\u001b[1;31m " + resp3.response)
model.setContext(resp3.context as number[])

const resp4 = await model.ask(`You gain 8 points of happiness, what is your new total happiness?\n\n
update this schema :\n\n
{
    "total_happiness": value, 
    "power2" : schema.total_happiness*schema.total_happiness
}`)
console.log("\u001b[1;32m " + resp4.response)

model.setContext(resp4.context as number[])
const resp5 = await model.ask(`add a new third property named anger with a value of 'false' at the end of the last schema.\n\n
example :\n\n
{
    "total_happiness": value, 
    "power2" : schema.total_happiness*schema.total_happiness,
    "anger" : boolean
}
`)
console.log("\u001b[1;33m " + resp5.response)

model.setContext([])
model.setSystemPrompt('You are a helpful assistant. Only reply with numerical values.')
const resp6 = await model.ask(`here is a json object :\n\n
${resp5.response}\n\n
what is the value of power2 ?`)

console.log("\u001b[1;33m " + resp6.response)