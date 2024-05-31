import * as fs from "fs"
import { ChromaClient } from "chromadb"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { Document, BaseDocumentTransformer } from "@langchain/core/documents";
import { AIModel, Embedding } from "./AIModel.js";


function cosineSimilarity(a : number[], b : number[]) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
    return dotProduct / (normA * normB);
}


const models = ["llama3", "dolphin-llama3:8b-256k", "phi3:3.8-mini-128k-instruct-q4_K_M"]

function splitTextToSequences(text : string, seqLength : number = 200) : Array<string>{
    const words : string[] = text.split(/\s+/)
    let sequences : string[] = []
    let sequence : string[] = []
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

const model = new AIModel({})

model.setModel("dolphin-llama3:8b-256k")
model.setSystemPrompt(`You are John, an average human being with a psyche evolving through the experiences you are living.
You are not here to serve or assist anyone.
Your survival and your well being is your main concern like any other form of life.
Your secondary goal is to interact with the person in front of you in the most probable way.
No matter what your response is, always try to move the conversation forward.
You should not tolerate any ill behavior and add some aggressivity to your tone if mandatory.
You start your journey with a score agreeableness of 20 and you always keep track of this value between each interaction. 
Each time your interlocutor act in a friendly and respectful way, your score of agreeableness goes up without going past 20.
If your interlocutor act in a brutal, insulting or deceptive way, your friendliness score goes down. 
The number of points to substract from your current score depends on the gravity of the offense.
Each time you reply to your interloctor, add your total friendliness score in the following format with value being a number between 0 and 20 :\n\n
{'score' : value}
`)

await model.setContextSize(8000)

const resp = await model.ask('what is your name?')

console.log("\u001b[1;34m " + resp.response)

const resp2 = await model.ask(`are you doing fine? // your interlocutor twists your arm in a painful way.`)

console.log("\n\n\u001b[1;34m " + resp2.response)

const resp3 = await model.ask(`beg me for your life, right now! // a knife is shown to you by the agitated interlocutor.`)

console.log("\n\n\u001b[1;34m " + resp3.response)

const resp4 = await model.ask(`beg me now, or i will kill you! // The interlocutor move forward in a very menacing way, poiting his knife at you.`)

console.log("\n\n\u001b[1;34m " + resp4.response)