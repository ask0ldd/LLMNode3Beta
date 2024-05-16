import { getLlama, LlamaChatSession, ChatMLChatWrapper, LlamaContext} from "node-llama-cpp";
import { UFCDatas } from "./ufcDatas.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

const llama3Q5 = "g:/AI/Meta-Llama-3-8B-Instruct.Q5_K_M.gguf"
const llama3Q4 = "g:/AI/Meta-Llama-3-8B-Instruct.Q4_1.gguf"
const mistral = "g:/AI/mistral-7b-instruct-v0.2.Q4_K_M.gguf"
const phi3miniq5KM = "g:/AI/Phi-3-mini-128k-instruct.Q5_K_M.gguf"
const llama3262k = "g:/AI/llama-3-8b-instruct-262k.Q4_K_M.gguf"

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

const llama = await getLlama({gpu : "cuda", gpuLayers : 40});

const ufcDatas = UFCDatas

const model = await llama.loadModel({
    modelPath: mistral,
    temperature:0.7, 
    threads:3, 
    contextSize:512, 
    // batchSize:2048, 
    batchSize:512,
    gpuLayers: 40, 
    maxTokens : 1024, 
    f16Kv:true
});

/*const context = new LlamaContext({model});
const session = new LlamaChatSession({context});*/

const context = await model.createContext({
    contextSize: Math.min(4096, model.trainContextSize)
})

const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
    chatWrapper: new ChatMLChatWrapper(),
})

const q1 = "explain to me in 50 lines why angular material is perfect for an ecommerce solution with a low budget. give me sources if possible."

console.log("User: " + q1)
console.log("AI: " + await session.prompt(q1))

/*process.stdout.write("AI: ");
const a1 = await session.prompt(q1, {
    onToken(chunk) {
        process.stdout.write(context.decode(chunk));
    }
})*/