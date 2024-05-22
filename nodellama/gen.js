import {LlamaModel, LlamaContext, LlamaChatSession, LlamaEmbeddingContext} from "node-llama-cpp";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib"
import { formatDocumentsAsString } from "langchain/util/document"
import { RunnablePassthrough, RunnableSequence, } from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"
import * as fs from "fs"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, } from "@langchain/core/prompts"
import { UFCDatas } from "../ufcDatas.js";
import { aiPath } from "../env.js";

const llama3 = aiPath + "Meta-Llama-3-8B-Instruct.Q5_K_M.gguf"
const mistral = aiPath + "mistral-7b-instruct-v0.2.Q4_K_M.gguf"

async function fileToSplitDocs(filename){
  const text = fs.readFileSync(filename, "utf8")
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1500, chunkOverlap: 200, separators : ' ' })
  const docs = await textSplitter.createDocuments([text])
  return docs
}

async function stringToSplitDocs(string){
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1500, chunkOverlap: 200, separators : ' ' })
    const docs = await textSplitter.createDocuments([string])
    return docs
  }

const model = new LlamaModel({
    modelPath: mistral,
    temperature:0.7, 
    threads:3, 
    contextSize:512, 
    // batchSize:2048, 
    batchSize:512,
    gpuLayers: 40, 
    maxTokens : 1024, 
    f16Kv:true
})

const embeddingContext = new LlamaEmbeddingContext({
    model,
    contextSize: Math.min(4096, model.trainContextSize), 
    threads:3,
})

const docs = await stringToSplitDocs(UFCDatas)

let docsEmbedPairs = []

for(let i = 0; i< docs.length; i++) docsEmbedPairs.push({doc : docs[i], embedding : await embeddingContext.getEmbeddingFor(docs[i])})

/*const embedding = await embeddingContext.getEmbeddingFor(UFCDatas);

console.log(UFCDatas, embedding.vector);*/

embeddingContext.dispose()

const context = new LlamaContext({
    model,
    contextSize: Math.min(4096, model.trainContextSize),
})

const sysMessage = "You are a pirate, responses must be very verbose and in pirate dialect, add 'Arr, m'hearty!' to each sentence."

const session = new LlamaChatSession({
    contextSequence: context.getSequence(), 
    systemPrompt: sysMessage,
})

const answer = await session.prompt("what is the real name of batman?")

console.log({answer})

/*const text = "Hello world";
const embedding = await embeddingContext.getEmbeddingFor(text);

console.log(text, embedding.vector);*/