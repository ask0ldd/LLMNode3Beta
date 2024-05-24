import { model } from "./AIModel.js";
import * as fs from "fs"

function splitTextToSequences(text, seqLength){
    const words = text.split(/\s+/)
    let sequences = []
    let sequence = []
    for(let i = 0; i < words.length; i++){
        sequence.push(words[i])
        if(i % seqLength == 0 || i === words.length - 1){
            sequences.push(sequence.join(" "))
            sequence = []
        }
    }
    return sequences
}


const montecristo = fs.readFileSync('docs/montecristo-chapter1.txt', "utf8")
const chunkyMontecristo = splitTextToSequences(montecristo, 500)

chunkyMontecristo.forEach(async chunk => {
    const response = await model.embeddings(chunk)
    console.log(chunk)
    console.log(response.embedding)
})


model.setModel("dolphin-llama3:8b-256k")
model.setSystemPrompt(`You are a helpful assistant. 
You should take your time and always give the most well thought answer possible.`)
model.setContextSize = 22000

const resp = await model.ask("only use the following context to reply : \n\n'''" + montecristo.substring(0, 21000) + "'''.\n\n which italian proverb is said to edmond dantes?")

console.log(resp.response)