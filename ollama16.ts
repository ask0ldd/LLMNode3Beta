import { AIAgent } from "./AIAgent.js"
import { AIAgenticLibrary } from "./AIAgenticLibrary.js"
import { Browser } from "./Browser.js"

const searchResults = await Browser.search("node.js")

const htmlPageText = await Browser.fetchPage(searchResults[0].url)

if(htmlPageText == null) throw new Error()

/*const agent = new AIAgent("Line Formater Agent").setSystemPrompt("You are a expert linguist. When a text is sent to you, you should format it in the following way. For each capital letter, ask yourself if this letter is a marker for a new line. If it is, then add a new line to the original text. Don't try to be creative. Just follow this simple process and in the end, output the modified text. Nothing more than the formatted text. Here comes the text to format : \n\n")

agent.setRequest(htmlPageText)
let result = await agent.call()*/

AIAgenticLibrary.formatterAgent.setRequest(htmlPageText)
let result = await AIAgenticLibrary.formatterAgent.call()

//const agent2 = new AIAgent("Code Extracter Agent").setSystemPrompt("You are an expert developper and such it is easy for you to spot any code. You can recognize any programming langage. When a text is sent to you, you should extract the code out of it and output it as it is, with no annotations or delimiters added. Here comes the text to format : \n\n")

if(result) AIAgenticLibrary.codeExtracterAgent.setRequest(result)

// if(result) agent2.setRequest(result)
// result = await agent2.call()

result = await AIAgenticLibrary.codeExtracterAgent.call()