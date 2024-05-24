import { model } from "./AIModel.js";
import * as fs from "fs"

const models = ["llama3", "dolphin-llama3:8b-256k"]

model.setModel("dolphin-llama3:8b-256k")
model.setSystemPrompt(`You are a helpful assistant with a PHD in mathematics and a second one in artificial intelligence. 
You should take your time to give the most well thought answer possible.`)
// 21000
model.setContextSize = 0

const montecristoChapter1 = fs.readFileSync('docs/montecristo.txt', "utf8")

/*const resp = await model.ask("Summarize the following text in 30 lines : '''" + montecristoChapter1.substring(0, 7800-1) + "'''.")

console.log(resp.response)

model.setContext(resp.context)
const resp2 = await model.ask("Summarize the context into 5 lines.")

console.log("\n\n --- \n\n" + resp2.response)*/

model.ask("Summarize the following text in 30 lines : '''" + montecristoChapter1.substring(0, 7800-1) + "'''.")
.then(async response => {
    model.setContext(response.context)
    const resp2 = await model.ask("Summarize the context into 5 lines.")
    console.log("\n\n --- \n\n" + resp2.response)
})