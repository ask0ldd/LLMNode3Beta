import { AIAgent } from "./AIAgent.js"
import { Browser } from "./Browser.js"

/*const searchResults = await Browser.search("node.js")

const htmlPageText = await Browser.fetchPage(searchResults[0].url)

if(htmlPageText == null) throw new Error()*/

const toolsList = {
    frenchTranslatingTool : "used to translate any text to french",
    codeExtractingTool : "get the code out of any text",
    codeConvertingToPythonTool : "convert any code to python",
    codeConvertingToRustTool : "convert any code to python",
    jokeWritingTool : "write a random joke",
    unitTestWritingTool : "write unit tests for any code and any langage"
}

const agent = new AIAgent("Planning Agent").setSystemPrompt(`You are an expert at planning tasks, especially technology related ones.\n\n
I want to meet my goal. What tools should i use? Your answer should be a simple javascript array containing the needed tools. Nothing more. No commentary coming from you and no annotation of any kind. For example :\n\n
[tool1, tool2, tool3, ...]\n\n
Here are the tool i have at my disposal :\n\n
${JSON.stringify(toolsList)}`)

const myGoal = "I have some text and mixed within it's body, there is some javascript code. I want to convert it to the Rust langage and just get rid of anything that is not code related. Then i want to write some unit tests for the Rust code."
agent.setRequest("my goal :\n\n"+myGoal)
let result = await agent.call()

console.log(result)

/*const agent2 = new AIAgent("Code Extracter Agent").setSystemPrompt("You are an expert developper and such it is easy for you to spot any code. You can recognize any programming langage. When a text is sent to you, you should extract the code out of it and output it as it is, with no annotations or delimiters added. Here comes the text to format : \n\n")

if(result) agent2.setRequest(result)
result = await agent2.call()*/

/*
    const record = {
    1: "value1",
    2: "value2",
    3: "value3"
    };

    Object.keys(record).forEach(key => {
    console.log(`Key: ${key}, Value: ${record[key]}`);
    });
*/