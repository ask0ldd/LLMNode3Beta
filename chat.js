import { getLlama, LlamaChatSession, ChatMLChatWrapper} from "node-llama-cpp";
import { UFCDatas } from "./ufcDatas.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

const llama3Q5 = "g:/AI/Meta-Llama-3-8B-Instruct.Q5_K_M.gguf"
const llama3Q4 = "g:/AI/Meta-Llama-3-8B-Instruct.Q4_1.gguf"
const mistral = "g:/AI/mistral-7b-instruct-v0.2.Q4_K_M.gguf"
const phi3miniq5KM = "g:/AI/Phi-3-mini-128k-instruct.Q5_K_M.gguf"

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

/*const pirateContext = new SystemMessage(
    "You are a pirate, responses must be very verbose and in pirate dialect, add 'Arr, m'hearty!' to each sentence."
)

const helpfulAssistantContext = new SystemMessage("You are a helpful assistant.")

const knowledgeContext = new SystemMessage(
    "You are a helpful assistant responding in the most concise way possible. Your response should be followed by three questions that the user could ask to get more knowledge about the related topic. Who should know about those facts : " + UFCDatas
)

const knowledgeContext2 = new SystemMessage(
    "You are a helpful assistant, reponses contains three related questions at the end, and you should know about those facts : " + UFCDatas
)*/

// const llama = await getLlama("lastBuild");

const llama = await getLlama({gpu : "cuda", gpuLayers : 40});

const ufcDatas = UFCDatas

const question1 = "explain to me in 50 lines why angular material is perfect for an ecommerce solution with a low budget. give me sources if possible."

const question2 = "explain to me in 50 lines why the reactive programming paradigm is perfect for an ecommerce solution with a low budget. give me sources if possible."

const prompt = "You are a winner of the nobel price of litterature with 50 years of experience as a writer. Your writing style should be reflective of such an accomplishement. The plot and twist of your stories should be inspired by Christopher Nolan ways. Your story should be beautiful and sad, in the style of 'HER' directed by Spike Jonze. The plot should follow the monomyth. And the main character should be inspired by the INTJ mbti personality profile. Write a 200 lines story about a boy secretly adopted by a robot. Right now, I'm in pain and a good story is the only way for me to forget my suffering. Do your best please."

const codeprompt = "write for me the html code and the css for a responsive 3 blocks layout which shouldn't exceed 1440px in width. the height of the blocks should be the height of the browser active surface. use flexbox as much as possible."


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

const context = await model.createContext({
    contextSize: Math.min(4096, model.trainContextSize)
});

const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
    chatWrapper: new ChatMLChatWrapper(),
})


/*console.log("User: " + question1);

const a1 = await session.prompt(question1);
console.log("AI: " + a1);

console.log("User: " + question2);

const a2 = await session.prompt(question2);
console.log("AI: " + a2);*/

console.log("User: " + prompt)
console.log("AI: " + await session.prompt(prompt))


// ask number of blocks in desktop
// ask direction in mobile



// the total plot should cover X chapter
// wrote a 3 phrase summary for each chapter
// write the first chapter, which should be 100/X percent of the whole plot
// this info is technical, it should be used to build the plot but shouldn't influence the style of the delivered writing.
// itw extracts from best directors & writers