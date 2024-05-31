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
model.setSystemPrompt(`You are an helpful assistant. Your reply should always follow given schema. No need for any commentary or explaination. Calculate all the values delivered into the json.`)
model.setTemperature(0)

await model.setContextSize(8000)

const resp = await model.ask(`Your total happiness should start at 20\n\n
schema : { "total_happiness": value, "power2" : schema.total_happiness*schema.total_happiness }`)

console.log("\u001b[1;34m " + resp.response)

model.setContext(resp.context as number[])

const resp2 = await model.ask(`You lose 2 points of happiness, what is your new total happiness right now?\n\n
update this schema : { "total_happiness": value, "power2" : schema.total_happiness*schema.total_happiness }`)

console.log("\u001b[1;35m " + resp2.response)

model.setContext(resp2.context as number[])

const resp3 = await model.ask(`You lose 2 points of happiness, what is your new total happiness right now?
\n\n update this schema : { "total_happiness": value, "power2" : schema.total_happiness*schema.total_happiness }`)

console.log("\u001b[1;31m " + resp3.response)