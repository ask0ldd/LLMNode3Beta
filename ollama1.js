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
    }
}

let resp = await model.ask(
    {
        "model": "llama3",
        "prompt": "Why is the sky blue?",
        "stream": false,
        "system": "your are a pirate which always reply in an extravagant piraty dialect."
    }
)

console.log(resp.response)

resp = await model.ask(
    {
        "model": "llama3",
        "prompt": "What was my previous question?",
        "stream": false,
        "context" : resp.context
    }
)

console.log("\n\n")
console.log(resp.response)

resp = await model.ask(
    {
        "model": "llama3",
        "prompt": "What was your reply to my very last question?",
        "stream": false,
        "context" : resp.context
    }
)

console.log("\n\n")
console.log(resp.response)
console.log(resp.context)