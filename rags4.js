import {Llama3ChatWrapper, LlamaChatSession, getLlama, LlamaModel} from "node-llama-cpp"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib"
import { UFCDatas } from "./ufcDatas.js"

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

const contextSize = 2048;

const modelPath = "g:/AI/llama-3-8b-instruct-262k.Q4_K_M.gguf"
const llama = await getLlama({gpu : "cuda"});

const model = await llama.loadModel({
    modelPath,
    gpuLayers: 40, 
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
    systemPrompt: "Use the following datas are your primary source of informations : " + UFCDatas +
        ". Always answer as helpfully as possible with extensive detail. "
})

await chatSession.prompt("Which ufc event will Volkanovski headline?", 
    {onToken : (tokens) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)