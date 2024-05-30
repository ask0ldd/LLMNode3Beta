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

async function stringToSplitDocs(string : string) : Promise<Document[]>{
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1500, chunkOverlap: 200, separators : [' '] })
    const docs = await textSplitter.createDocuments([string])
    return docs
}

const montecristo = fs.readFileSync('docs/toserveman.txt', "utf8")
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

const chromaClient = new ChromaClient()
await chromaClient.deleteCollection({name : "mycollection"})
const collection = await chromaClient.createCollection({name : "mycollection", metadata: { "hnsw:space": "cosine" },})

await collection.add({ids : ids, embeddings: embeddings, documents: chunkyMontecristo})

console.log(chunkyMontecristo[0])

const queryEmbedding = await model.embeddings("what is the real use of the alien book?")
const ragResults = await collection.query({queryEmbeddings : queryEmbedding.embedding, nResults:3});
console.log("\n\n\u001b[1;33m " + ragResults.documents[0][0]);
console.log("\n\n\u001b[1;35m " + ragResults.documents[0][1]);
console.log("\u001b[1;34m " + ragResults.ids);
console.log(ragResults.distances)

model.setModel("dolphin-llama3:8b-256k")
model.setSystemPrompt(`You are a helpful assistant. Avoid repeting the same pieces of information or the same facts multiple times. Give emphasis to the parts that stand out. Use a descriptive journalistic tone. You are not a novelist but a scholar writing essays for a living.`)
// model.setContextSize(22000)

const resp = await model.ask(`extract those those three chunks of text and rewrite them into one global text : \n\n''' {'chunk1' : '${ragResults.documents[0][0]}', \n\n 'chunk2': '${ragResults.documents[0][1]}', \n\n 'chunk3' : '${ragResults.documents[0][2]}'} '''`)

console.log("\u001b[1;34m " + resp.response)