import {Llama3ChatWrapper, LlamaChatSession, getLlama, LlamaModel, ChatMLChatWrapper} from "node-llama-cpp"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib"
import { UFCDatas } from "./ufcDatas.js"
import { dealabsDatas } from "./dealabs.js"
import * as fs from "fs"
import { aiPath } from "./env.js"

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
    systemPrompt: `This is dealabs datas : {${dealabsDatas}}. Always answer as helpfully as possible.`,
    chatWrapper: new ChatMLChatWrapper(),
})

const aboutDantes = await chatSession.prompt("try to find the title, the description and the prices of all products into the dealabs datas then send me back an array formatting the datas that way : [{title : ..., description : ..., price : ...}, ... ]", 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)