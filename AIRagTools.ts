import * as fs from "fs"
import { ChromaClient, Collection, Embedding } from "chromadb"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { AIModel } from "./AIModel"

export class AIRAGTools{

    static #chromaClient : ChromaClient = new ChromaClient()
    static #chromeCollections : {name : string, collection : Collection}[]= []

    static async initChromaCollection(collectionName : string) {
        const collection = await this.#chromaClient.createCollection({name : collectionName, metadata: { "hnsw:space": "cosine" },})
        this.#chromeCollections.push({name : collectionName, collection })
    }

    static async addToChromaCollection(collectionName : string, embeddingObj : { ids : string[], embeddings : Embedding[], documentChunks : string[]}) {
        const collection = this.#chromeCollections.find(collection => collection.name == collectionName)?.collection
        if(collection) await collection.add({ids : embeddingObj.ids, embeddings: embeddingObj.embeddings, documents: embeddingObj.documentChunks})
    }

    /*
    await chromaClient.deleteCollection({name : "mycollection"})
    const collection = await chromaClient.createCollection({name : "mycollection", metadata: { "hnsw:space": "cosine" },})
    await collection.add({ids : ids, embeddings: embeddings, documents: chunkyMontecristo})*/

    static splitStringToEmbeddableChunks(text : string, seqLength : number) : string[] {
        const words = text.split(/\s+/)
        let sequences = []
        let sequence = []
        for(let i = 0; i < words.length; i++){
            sequence.push(words[i])
            if(i == 0) continue
            if(i % seqLength == 0 || i === words.length - 1){
                sequences.push(sequence.join(" "))
                sequence = []
            }
        }
        return sequences
    }

    static splitUtf8TxtFileToEmbeddableChunks(filePath : string, seqLength  : number) : string[]{
        try{
            const file = fs.readFileSync(filePath, "utf8")
            return this.splitStringToEmbeddableChunks(file, 200)
        }catch(error: any){
            console.log(error)
            return []
        }
    }

    static async splitAndEmbedUtf8TxtFile(filePath : string, model : AIModel, seqLength = 200) : Promise<Embedding[]>{
        const chunks = this.splitUtf8TxtFileToEmbeddableChunks(filePath, seqLength)
        let embeddings = []
        let ids = []
        let index = 1
        for(const chunk of chunks){
            const response = await model.embeddings(chunk)
            embeddings.push(response.embedding as Embedding)
            ids.push('id'+index)
            index++
        }
        return embeddings
    }
}