import * as fs from "fs"
import { ChromaClient } from "chromadb"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

function splitTextToSequences(text : string, seqLength : number = 200) : Array<string>{
    const words : Array<string> = text.split(/\s+/)
    let sequences : Array<string> = []
    let sequence : Array<string> = []
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

