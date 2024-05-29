import { model } from "../AIModel.js";
import * as fs from "fs"
import { ChromaClient } from "chromadb"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

function splitTextToSequences(text, seqLength){
    const words = text.split(/\s+/)
    let sequences = []
    let sequence = []
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

async function stringToSplitDocs(string){
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1500, chunkOverlap: 200, separators : ' ' })
    const docs = await textSplitter.createDocuments([string])
    return docs
}


const montecristo = fs.readFileSync('docs/toserveman.txt', "utf8")
const chunkyMontecristo = splitTextToSequences(montecristo, 200)
/*const docs = await stringToSplitDocs(montecristo)
const chunkyMontecristo = docs.map(doc => doc.pageContent)*/

let embeddings = []
let ids = []
let index = 1
for(const chunk of chunkyMontecristo){
    const response = await model.embeddings(chunk)
    embeddings.push(response.embedding)
    ids.push('id'+index)
    index++
}

const chromaClient = new ChromaClient()
await chromaClient.deleteCollection({name : "mycollection"})
const collection = await chromaClient.createCollection({name : "mycollection", metadata: { "hnsw:space": "cosine" },})

await collection.add({ids : ids, embeddings: embeddings, documents: chunkyMontecristo})

/*for(const chunk of chunkyMontecristo){
    // console.log(chunk)
    const response = await model.embeddings(chunk)
    await collection.add({ids : ['id' + index], embeddings: response.embedding, documents: [chunk]})
    index++
}*/

console.log(chunkyMontecristo[0])

const queryEmbedding = await model.embeddings("what is the real use of the alien book?")
// console.log(queryEmbedding.embedding)
const ragResults = await collection.query({queryEmbeddings : queryEmbedding.embedding, nResults:3});
console.log("\n\n\u001b[1;33m " + ragResults.documents[0][0]);
console.log("\n\n\u001b[1;35m " + ragResults.documents[0][1]);
console.log("\u001b[1;34m " + ragResults.ids);
console.log(ragResults.distances)


model.setModel("dolphin-llama3:8b-256k")
model.setSystemPrompt(`You are a helpful assistant.`/*+` 
You should take your time and always give the most well thought answer possible.`*/)
model.setContextSize = 22000

const resp = await model.ask("Only use the following informations to reply any question : \n\n'''" + ragResults.documents[0][0] + ragResults.documents[0][1] + ragResults.documents[0][2] /*montecristo.substring(0,21000)*/ + "'''.\n\n what is the real use of the alien book?")

console.log("\u001b[1;34m " + resp.response)