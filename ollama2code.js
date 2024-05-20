import * as fs from "fs"

const model = {
    modelName: "llama3",
    stream: false,
    systemPrompt: 'You are a helpful assistant.',
    context: [],

    ask: async (prompt) => {
        const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: model.buildRequest(prompt),
        });
        return response.json()
    },

    buildRequest: (prompt) => {
        return JSON.stringify({
            "model": model.modelName,
            "stream": model.stream,
            "system": model.systemPrompt,
            "prompt": prompt,
            "context" : model.context
        })
    },

    setSystemPrompt: (prompt) => {
        model.systemPrompt = prompt
    },

    setModel: (modelName) => {
        model.modelName = modelName
    },

    setContext : (context ) => {
        model.context = context
    }
};

model.setModel("llama3")

model.setSystemPrompt(`You are a senior developper, top of the line engineer, as proficient as Meta's engineer Dan Abramov when dealing with React and javascript code. 
Your response should always be a one liner json with two properties, jsx and css. 
Nothing more than this json is expected. No explainations needed. Don't use the following character : '''\`'''`)

let resp = await model.ask(
    `Produce a responsive functional component for a header. 
    You should care a lot about the semantic used. 
    This header should contain a logo on the left and a menu on its right side. 
    The menu should contain the following items : **home, product, about us, settings**. Name the logo : **placeholder.jpg**.
`)

console.log('\u001b[1;32m ' + resp.response)

const parsedResponse = JSON.parse(resp.response.replace(/\\n/g, '').replace(/\n/g, ''))

/*console.log('\u001b[1;33m ' + parsedResponse.css)
console.log('\u001b[1;34m ' + parsedResponse.jsx)*/

model.setSystemPrompt(`
    You are a senior developper, top of the line engineer, as proficient as Meta's engineer Dan Abramov when dealing with React and javascript code.
    **IMPORTANT : Reply with the requested EXECUTABLE CODE ONLY. No explainations. No comments. The output can only be a string. no triple ticks delimitors.**
`)

const reformatCSS = await model.ask(`reformat the following css : **${parsedResponse.css}**`)
const reformatJSX = await model.ask(`reformat the following jsx : **${parsedResponse.jsx}**`)

console.log('\u001b[1;33m ' + reformatCSS.response)
console.log('\u001b[1;34m ' + reformatJSX.response)

fs.writeFileSync("./testfiles/test.css", reformatCSS.response)
fs.writeFileSync("./testfiles/test.jsx", reformatJSX.response)