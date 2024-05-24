import { model } from "./AIModel.js";
import * as fs from "fs"
import { ChromaClient } from "chromadb"
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib"

function splitTextToSequences(text, seqLength){
    const words = text.split(/\s+/)
    let sequences = []
    let sequence = []
    for(let i = 0; i < words.length; i++){
        sequence.push(words[i])
        if(i % seqLength == 0 || i === words.length - 1){
            sequences.push(sequence.join(" "))
            sequence = []
        }
    }
    return sequences
}


const montecristo = fs.readFileSync('docs/state_of_the_union.txt', "utf8")
const chunkyMontecristo = splitTextToSequences(montecristo, 500)

let embeddings = []
let ids = []
let index = 0
for(const chunk in chunkyMontecristo){
    const response = await model.embeddings(chunk)
    embeddings.push(response.embedding)
    ids.push('id'+index)
    index++
}

console.log(embeddings.length)
console.log(chunkyMontecristo.length)

const chromaClient = new ChromaClient()
await chromaClient.deleteCollection({name : "mycollection"})
const collection = await chromaClient.createCollection({name : "mycollection", metadata: { "hnsw:space": "cosine" },})
await collection.add({ids : ids, embeddings: embeddings, documents: chunkyMontecristo})

const queryEmbedding = await model.embeddings("which is the company that helped build the silicon valley?")
// console.log(queryEmbedding.embedding)
const ragResults = await collection.query({queryEmbeddings : queryEmbedding.embedding, nResults:3});
console.log("\u001b[1;33m " + ragResults.documents[0]);
console.log(ragResults.distances)


model.setModel("dolphin-llama3:8b-256k")
model.setSystemPrompt(`You are a helpful assistant.`/*+` 
You should take your time and always give the most well thought answer possible.`*/)
model.setContextSize = 22000

const resp = await model.ask("Only use the following informations to reply any question : \n\n'''" + ragResults.documents[0][0] + `. ` + ragResults.documents[0][1] + `. ` + ragResults.documents[0][2] /*montecristo.substring(0,21000)*/ + "'''.\n\n which is the company that helped build the silicon valley?")

console.log("\u001b[1;34m " + resp.response)