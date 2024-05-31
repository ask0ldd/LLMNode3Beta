import * as fs from "fs"
import { ChromaClient } from "chromadb"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { Document, BaseDocumentTransformer } from "@langchain/core/documents";
import { AIModel, Embedding } from "./AIModel.js";


function cosineSimilarity(a : number[], b : number[]) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
    return dotProduct / (normA * normB);
}


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

const montecristo = fs.readFileSync('docs/state_of_the_union.txt', "utf8")
const chunkyMontecristo = splitTextToSequences(montecristo, 200)

const model = new AIModel({})

let embeddings : Array<Embedding> = []
let ids : Array<string> = []
let index = 1
for(const chunk of chunkyMontecristo){
    const response : {embedding : Embedding} = await model.embeddings(chunk)
    embeddings.push(response.embedding)
    ids.push('id'+index)
    index++
}

/*const catEmb = await model.embeddings("what is a cat?")
const ygcatEmb = await model.embeddings("what is a young cat?")
const kittenEmb = await model.embeddings("what is a kitten?")

console.log('catkitten : ' + cosineSimilarity(catEmb.embedding, kittenEmb.embedding))
console.log('catygcat : ' + cosineSimilarity(catEmb.embedding, ygcatEmb.embedding))
console.log('kittenygcat : ' + cosineSimilarity(kittenEmb.embedding, ygcatEmb.embedding))*/

const chromaClient = new ChromaClient()
await chromaClient.deleteCollection({name : "mycollection"})
const collection = await chromaClient.createCollection({name : "mycollection", metadata: { "hnsw:space": "cosine" },})

await collection.add({ids : ids, embeddings: embeddings, documents: chunkyMontecristo})

console.log(chunkyMontecristo[0])

const queryEmbedding = await model.embeddings("how much money can putin invest into the war?")
const ragResults = await collection.query({queryEmbeddings : queryEmbedding.embedding, nResults:3});
console.log("\n\n\u001b[1;33m " + ragResults.documents[0][0]);
console.log("\n\n\u001b[1;31m " + ragResults.documents[0][1]);
console.log("\n\n\u001b[1;32m " + ragResults.documents[0][2]);
console.log("\u001b[1;34m " + ragResults.ids);
console.log(ragResults.distances)
const resultId = ragResults.ids[0][0]
console.log('id' + (parseInt(resultId.substring(2, resultId.length))-1))
const prevResults = await collection.get({ids:[
    'id' + (parseInt(resultId.substring(2, resultId.length))-1),
    'id' + (parseInt(resultId.substring(2, resultId.length))),
    'id' + (parseInt(resultId.substring(2, resultId.length))+1),
]})
/*
const concat = prevResults.documents[0] ? prevResults.documents[0][0] + prevResults.documents[0][1] + prevResults.documents[0][2] : ""
console.log(concat)*/

model.setModel("dolphin-llama3:8b-256k")
model.setSystemPrompt(`You are a helpful, great and smart assistant. Use only the context to reply.`)
// model.setContextSize(22000)

const resp = await model.ask(`*** question : \n\n
how much money can putin invest into the war \n\n
*** context : \n\n
${ragResults.documents[0][0]}...${ragResults.documents[0][1]}...${ragResults.documents[0][2]}\n\n***`)

console.log("\u001b[1;34m " + resp.response)