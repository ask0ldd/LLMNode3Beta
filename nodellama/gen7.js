// testing if i could inject the whole first chapter of montecristo into the sys prompt

import {Llama3ChatWrapper, LlamaChatSession, getLlama, LlamaModel, ChatMLChatWrapper} from "node-llama-cpp"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib"
import { UFCDatas } from "../ufcDatas.js"
import * as fs from "fs"
import { aiPath } from "../env.js"

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

const montecristoFileName = aiPath + "montecristo-chapter1.txt"
const montecristoChapter1 = fs.readFileSync(montecristoFileName, "utf8")


const contextSize = 15500;

const modelPath = aiPath + "llama-3-8b-instruct-262k.Q4_K_M.gguf"
const modelPath2 = aiPath + "Phi-3-mini-128k-instruct.Q5_K_M.gguf"
const llama = await getLlama({gpu : "cuda"});

const model = await llama.loadModel({
    modelPath : modelPath,
    gpuLayers: 33, 
});

const context = await model.createContext({
    contextSize,
    // threads:3,
});

const chatSession = new LlamaChatSession({
    contextSequence: context.getSequence(),
    systemPrompt: `Use the follow context as your main source of informations : ${montecristoChapter1}. Always answer as helpfully as possible with extensive detail.`,
    chatWrapper: new ChatMLChatWrapper(),
})

const aboutDantes = await chatSession.prompt("Summarize all the things you know about Dantes.", 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

// chatSession.getChatHistory().forEach(hist => console.log(hist.text))