import {Llama3ChatWrapper, LlamaChatSession, getLlama, LlamaModel} from "node-llama-cpp"

const modelPath = "g:/AI/bge-small-en-v1.5-q8_0.gguf";

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

const embeddingContext = await model.createEmbeddingContext({
    contextSize: 4096
});

const helloWorldEmbedding = await embeddingContext.getEmbeddingFor("Hello world");
const helloThereEmbedding = await embeddingContext.getEmbeddingFor("Hello there");

console.log(helloThereEmbedding)
console.log(helloWorldEmbedding)