import * as fs from "fs"
import { ChromaClient, Collection, Embedding, QueryResponse } from "chromadb"
import { AIModel } from "./AIModel"
import { AIEmbeddingModel } from "./AIEmbeddingModel"

export class AIRAGStore{

    #chromaClient : ChromaClient = new ChromaClient()
    #collections : Collection[]= []

    constructor() {
        return this
    }

    async newCollection(collectionName : string) {
        if(this.#collections.find(collection => collection.name == collectionName)) this.deleteCollection(collectionName)
        const collection = await this.#chromaClient.createCollection({name : collectionName, metadata: { "hnsw:space": "cosine" },})
        this.#collections.push(collection)
    }

    async addToCollection(collectionName : string, RAGTarget : { ids : string[], embeddings : Embedding[], documentChunks : string[]}) {
        const collection = this.#collections.find(collection => collection.name == collectionName)
        if(!collection) throw new Error(`Collection ${collectionName} does not exist`)
        await collection.add({ids : RAGTarget.ids, embeddings: RAGTarget.embeddings, documents: RAGTarget.documentChunks})
    }

    getCollection(collectionName : string): Collection {
        const collection = this.#collections.find(collection => collection.name == collectionName)
        if(!collection) throw new Error(`Collection ${collectionName} does not exist`)
        return collection
    }

    splitTextBlockIntoChunks(text : string, seqLength : number) : string[] {
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

    splitUtf8TextFileIntoChunks(filePath : string, seqLength  : number) : string[]{
        try{
            const fileContent = fs.readFileSync(filePath, "utf8")
            return this.splitTextBlockIntoChunks(fileContent, 200)
        }catch(error: any){
            console.log(error)
            return []
        }
    }

    async storeUtf8TextFileInACollection(collectionName : string, textFilePath : string, seqLength = 200){
        const chunks = this.splitUtf8TextFileIntoChunks(textFilePath, seqLength)
        let embeddings = []
        let ids = []
        let index = 1
        for(const chunk of chunks){
            const response = await AIEmbeddingModel.process(chunk)
            embeddings.push(response.embedding)
            ids.push('id'+index)
            index++
        }
        const RAGTarget = {ids, embeddings, documentChunks: chunks}
        this.addToCollection(collectionName, RAGTarget)
    }

    async deleteCollection(collectionName : string){
        await this.#chromaClient.deleteCollection({name : collectionName})
    }

    async retrieveFromCollection(collectionName : string, query : string, nResults = 3): Promise<QueryResponse>{
        const queryEmbedding = await AIEmbeddingModel.process(query)
        const collection = this.getCollection(collectionName)
        const ragResults = await collection.query({queryEmbeddings : queryEmbedding.embedding, nResults})
        return ragResults
    }
}