import * as fs from "fs"
import { ChromaClient } from "chromadb"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

export class AIRAGTools{

    static splitStringToSequences(text : string, seqLength : number) : string[] {
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

    static splitUtf8TxtFileToSequences(filePath : string, seqLength  : number) : string[]{
        try{
            const file = fs.readFileSync(filePath, "utf8")
            return this.splitStringToSequences(file, 200)
        }catch(error: any){
            console.log(error)
            return []
        }
    }

}