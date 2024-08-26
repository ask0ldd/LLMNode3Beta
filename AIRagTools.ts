import * as fs from "fs"
import { ChromaClient } from "chromadb"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { AIModel } from "./AIModel"

export class AIRAGTools{

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

    static async splitAndEmbedUtf8TxtFile(filePath : string, model : AIModel, seqLength = 200){
        const chunks = this.splitUtf8TxtFileToEmbeddableChunks(filePath, seqLength)
        let embeddings = []
        let ids = []
        let index = 1
        for(const chunk of chunks){
            const response = await model.embeddings(chunk)
            embeddings.push(response.embedding)
            ids.push('id'+index)
            index++
        }
        return embeddings
    }

}