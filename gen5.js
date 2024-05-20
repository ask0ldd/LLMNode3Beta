import {Llama3ChatWrapper, LlamaChatSession, getLlama, LlamaModel, ChatMLChatWrapper} from "node-llama-cpp"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib"
import { UFCDatas } from "./ufcDatas.js"
import * as fs from "fs"
import { aiPath } from "./env";

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
    contextSize
});

/*const chatSession = new LlamaChatSession({
    contextSequence: context.getSequence(),
    systemPrompt: "Use the following datas are your primary source of informations : " + UFCDatas +
        ". Always answer as helpfully as possible and summarize as much as you can your reply. "
})*/

const chatSession = new LlamaChatSession({
    contextSequence: context.getSequence(),
    systemPrompt: "Use the following datas as your only source of informations : " + montecristoChapter1.substring(0, 10000) +
        ". Always answer as helpfully as possible with extensive detail.",
    chatWrapper: new ChatMLChatWrapper(),
})

await chatSession.prompt("Summarize all the things you know about Dantes.", 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)