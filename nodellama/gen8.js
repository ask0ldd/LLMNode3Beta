// testing if i could create an html layout and rework it step by step

import {Llama3ChatWrapper, LlamaChatSession, getLlama, LlamaModel, ChatMLChatWrapper} from "node-llama-cpp"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import * as fs from "fs"
import { method, method2 } from "../methods.js";
import { aiPath } from "../env.js";

const contextSize = 15500;

const modelPath = aiPath + "llama-3-8b-instruct-262k.Q4_K_M.gguf"
const modelPath2 = aiPath + "Phi-3-mini-128k-instruct.Q5_K_M.gguf"
const llama = await getLlama({gpu : "cuda"});

let lastProgress = 0
const model = await llama.loadModel({
    modelPath : modelPath,
    // gpuLayers: 33, 
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

/*const javadoc = await chatSession.prompt("Improve the following method : " + method2, 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)*/

// chatSession.getChatHistory().forEach(hist => console.log(hist.text))

await chatSession.prompt("give me the 3 most used html layouts for a landing page. no css needed. then write the html code for those three layouts. don't neglect the html semantic.", 
{onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

await chatSession.prompt("rework the three columns layout by taking the middle column and adding 'kirikou' as a title instead of the generic value used. give me the full layout with the changes included.", 
{onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

/*const svg = await chatSession.prompt("Generate the svg code for a phone icon. the background should be white and the fill and strokes should be red.", 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)*/

/*const svg = await chatSession.prompt("Create a three column html layout with a top header and a footer. No css needed. Consider the spatial position of all the elements. Retranscribe those elements (header and footer included) into a svg file, each block having a different color.", 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)*/

/*
const tab = await chatSession.prompt("Give me the lyrics for the song situations from escape the fate.", 
{onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)*/