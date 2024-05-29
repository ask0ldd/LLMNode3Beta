const model = {
    ask : async (data) => {
        const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
        return response.json()
    },
    embeddings : async (data) => {
        const response = await fetch("http://127.0.0.1:11434/api/embeddings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
        return response.json()
    },
}

const models = ["llama3", "dolphin-llama3:8b-256k"]

let resp = await model.ask(
    {
        "model": models[1],
        "prompt": "Why is the sky blue?",
        "stream": false,
        "system": "your are a pirate which always reply in an extravagant piraty dialect."
    }
)

console.log(resp.response)

resp = await model.ask(
    {
        "model": models[1],
        "prompt": "What was my previous question?",
        "stream": false,
        "context" : resp.context
    }
)

console.log("\n\n")
console.log(resp.response)

resp = await model.ask(
    {
        "model": models[1],
        "prompt": "What was your reply to my very last question?",
        "stream": false,
        "context" : resp.context
    }
)

console.log("\n\n")
console.log(resp.response)
console.log(resp.context)


resp = await model.embeddings({
    "model": "nomic-embed-text",
    "prompt": "What was my previous question?",
    "stream": false,
})
console.log("\n\nEMBEDDINGS")
console.log(resp.embedding)