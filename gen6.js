// trying to solve a whole school exercice step by step

import {Llama3ChatWrapper, LlamaChatSession, getLlama, LlamaModel, ChatMLChatWrapper} from "node-llama-cpp"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib"
import { UFCDatas } from "./ufcDatas.js"
import { tasksList, tasksList2, textOc } from "./testOC.js"
import * as fs from "fs"
import { aiPath } from "./env.js"

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
    systemPrompt: "These are the specifications that should be used to build an application, use it as your main source of informations : ```" + textOc +
        "```. Your answers should always be as condensed as possible.",
    chatWrapper: new ChatMLChatWrapper(),
})

console.log("\u001b[1;32m OBJECTIVES\n")
const result1 = await chatSession.prompt("List all objectives of Alisa's Closet as a bullepoints list.", 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

console.log("\n\n")
console.log("\u001b[1;33m USER STORIES\n")

const result2 = await chatSession.prompt("Decompose each points from the following list into one or multiple Agile user stories : " + result1, 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

console.log("\n\n")
console.log("\u001b[1;34m RISK MATRIX\n")

const result3 = await chatSession.prompt("Using the given context and this bulletpoint list : {" + result1 +  "}, build the most complete risks matrix that encompass all the unexpected events that could lead to the project being delayed or simply failing during production. It should contain the following columns : 'task', 'risk', 'probability', 'seriousness'", 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

console.log("\n\n")
console.log("\u001b[1;35m USER JOURNEY\n")

const result4 = await chatSession.prompt("Using the given context, describe the step by step expected user journey from basket validation to payment", 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

console.log("\n\n")

console.log("\u001b[1;36m BUSINESS FUNCTIONALITIES\n")

const result5 = await chatSession.prompt("Using the given context, describe all the business functionalities as a bulletpoint list. This list will be needed later to write a commercial proposal.", 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

console.log("\n\n")

console.log("\u001b[1;32m SMART GOALS\n")

const result6 = await chatSession.prompt("Using the given context and nothing more, break down the deliveryfit project into multiple smaller but coherent S.M.A.R.T. goals. Should be displayed as a list. A list with at least 20 rows is expected. Those goals should only be related to the deliveryfit application production tasks.", 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

console.log("\n\n")

console.log("\u001b[1;33m TABLEAU DE GESTION\n")

const result7 = await chatSession.prompt("Using the given context and nothing more, break down the deliveryfit project into multiple smaller but coherent S.M.A.R.T. goals then fill a table containing the following columns with those : 'task', 'complexity', 'estimated time for completion', 'team member assigned', 'TJM of the team member', 'safety time margin'. Those goals should only be related to the deliveryfit application production tasks.", 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

console.log("\n\n")

console.log("\u001b[1;34m TASKS\n")

const result8 = await chatSession.prompt("Using the given context, improve, correct and complete with details the following array of tasks" + tasksList2 + ". The produced tasks array should only be related to the deliveryfit application production process.", 
{onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)