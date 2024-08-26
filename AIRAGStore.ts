import * as fs from "fs"
import { ChromaClient, Collection, Embedding } from "chromadb"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { AIModel } from "./AIModel"

export class AIRAGStore{

    #chromaClient : ChromaClient = new ChromaClient()
    #chromaCollections : Collection[]= []

    constructor() {
        return this
    }

    async newCollection(collectionName : string) {
        if(this.#chromaCollections.find(collection => collection.name == collectionName)) throw new Error(`Collection ${collectionName} already exists`)
        const collection = await this.#chromaClient.createCollection({name : collectionName, metadata: { "hnsw:space": "cosine" },})
        this.#chromaCollections.push(collection)
    }

    async addToCollection(collectionName : string, embeddingObj : { ids : string[], embeddings : Embedding[], documentChunks : string[]}) {
        const collection = this.#chromaCollections.find(collection => collection.name == collectionName)
        if(!collection) throw new Error(`Collection ${collectionName} does not exist`)
        await collection.add({ids : embeddingObj.ids, embeddings: embeddingObj.embeddings, documents: embeddingObj.documentChunks})
    }

    splitTextBlockToEmbeddableChunks(text : string, seqLength : number) : string[] {
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

    splitUtf8TxtFileToEmbeddableChunks(filePath : string, seqLength  : number) : string[]{
        try{
            const file = fs.readFileSync(filePath, "utf8")
            return this.splitTextBlockToEmbeddableChunks(file, 200)
        }catch(error: any){
            console.log(error)
            return []
        }
    }

    async splitAndEmbedUtf8TxtFile(filePath : string, model : AIModel, seqLength = 200) : Promise<Embedding[]>{
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