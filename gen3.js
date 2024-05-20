import {Llama3ChatWrapper, LlamaChatSession, getLlama, LlamaModel} from "node-llama-cpp"
import { aiPath } from "./env";

const contextSize = 2048;

const modelPath = aiPath + "llama-3-8b-instruct-262k.Q4_K_M.gguf"
const llama = await getLlama({gpu : "cuda"});

const model = await llama.loadModel({
    modelPath,
    //temperature:0.7, 
    // threads:3, 
    // contextSize:512, 
    // batchSize:512,
    gpuLayers: 40, 
    // maxTokens : 1024, 
    // f16Kv:true
});

/*const model2 = new LlamaModel({
    modelPath: aiPath + "llama-3-8b-instruct-262k.Q4_K_M.gguf",
    chatWrapper: new Llama3ChatWrapper(),
    gpuLayers: 40, 
});*/

const context = await model.createContext({
    contextSize
});

const chatSession = new LlamaChatSession({
    contextSequence: context.getSequence(),
    systemPrompt: "You are a helpful, respectful and honest biologist. " +
        "Always answer as helpfully as possible with extensive detail."
});

await chatSession.prompt(
    "Remember this fact: Platypuses have venomous spurs on their hind legs. Answer with 'OK' to confirm you understand and remember this fact.",
    {onToken : (tokens /*: Token[]*/) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

await chatSession.prompt(
    "Create a concept for a new animal." +
    "Provide a realistic outline of this animal, including its social structures, appearance, habitat, origins and diet.",
    {onToken : (tokens /*: Token[]*/) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

await chatSession.prompt("What was the animal fact I asked you to remember earlier?", 
    {onToken : (tokens /*: Token[]*/) => process.stdout.write(model.detokenize(tokens)), maxTokens: contextSize}
)

/*await chatSession.prompt("Elaborate on its social structures", {maxTokens: contextSize});
await chatSession.prompt("Elaborate on its appearance", {maxTokens: contextSize});
await chatSession.prompt("Elaborate on its habitat", {maxTokens: contextSize});
await chatSession.prompt("Elaborate on its diet", {maxTokens: contextSize});
await chatSession.prompt("Elaborate on its origins", {maxTokens: contextSize});

const res = await chatSession.prompt("How much is 6+6", {maxTokens: 50});*/