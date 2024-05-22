import { model } from "./AIModel.js";
import * as fs from "fs"

model.setModel("dolphin-llama3:8b-256k")
model.setSystemPrompt(`You are a helpful assistant with a PHD in mathematics and a second one in artificial intelligence. 
You should take your time to give the most well thought answer possible.`)
model.setContextSize = 22000

const montecristoChapter1 = fs.readFileSync('docs/montecristo.txt', "utf8")

const resp = await model.ask("only use the following context to reply : \n\n'''" + montecristoChapter1.substring(0, 21000) + "'''.\n\n which italian proverb is said to edmond dantes?")

console.log(resp.response)