// testing if node llama remember my previous questions

import {Llama3ChatWrapper, LlamaChatSession, getLlama, LlamaModel, ChatMLChatWrapper} from "node-llama-cpp"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import * as fs from "fs"
import { method, method2 } from "./methods.js";
import { aiPath } from "./env.js";

const contextSize = 15500;

const modelPath = aiPath + "llama-3-8b-instruct-262k.Q4_K_M.gguf"
const modelPath2 = aiPath + "Phi-3-mini-128k-instruct.Q5_K_M.gguf"
const llama = await getLlama({gpu : "cuda"});

let lastProgress = 0
const model = await llama.loadModel({
    modelPath : modelPath,
    onLoadProgress(loadProgress) {
        if(loadProgress*100 - lastProgress >= 10) {
            lastProgress = loadProgress*100
            console.log(`\u001b[1;32m Load progress: ${loadProgress * 100}%`)
        }
    }
});

const context = await model.createContext({
    contextSize,
    // threads:3,
});

const chatSession = new LlamaChatSession({
    contextSequence: context.getSequence(),
    systemPrompt: `You are a professional programmer, as good as John Carmack or Dan Abramov. When you reply to my questions, take your time, go in depth and channel all your inner expertise.`,
    chatWrapper: new ChatMLChatWrapper(),
})

console.log("\n\n")
const tab = await chatSession.prompt("what is java?", 
{onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

console.log("\n\n")
await chatSession.prompt("what was my previous question?", 
{onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

console.log("\n\n")
await chatSession.prompt("what is java?", 
{onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

chatSession.setChatHistory([])

console.log("\n\n")
await chatSession.prompt("what was my previous question?", 
{onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)