/*
* models = dolphin-llama3:8b-256k, llama3
*/
export const model = {
    modelName: "dolphin-llama3:8b-256k",
    stream: false,
    systemPrompt: 'You are a helpful assistant.',
    context: [],
    contextSize : 0,

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

    embeddings : async (sequence) => {
        const response = await fetch("http://127.0.0.1:11434/api/embeddings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: model.buildEmbeddingRequest(sequence),
        });
        return response.json()
    },

    setSystemPrompt: (prompt) => {
        model.systemPrompt = prompt
    },

    setModel: (modelName) => {
        model.modelName = modelName
    },

    setContext : (context) => {
        model.context = context
    },

    setContextSize : (value) => {model.contextSize = value},
   
    buildRequest: (prompt) => {
        let baseRequest = {
            "model": model.modelName,
            "stream": model.stream,
            "system": model.systemPrompt,
            "prompt": prompt,
            "context" : model.context
        }
        if(model.contextSize != 0) baseRequest = {...baseRequest, "options": { "num_ctx": model.contextSize }}
        return JSON.stringify(baseRequest)
    },

    buildEmbeddingRequest : (sequence) => {
        return JSON.stringify({
            "model": "nomic-embed-text",
            "prompt": sequence,
            "stream": false,
        })
    },
};

/*
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Why is the sky blue?",
  "stream": false,
  "options": {
    "num_keep": 5,
    "seed": 42,
    "num_predict": 100,
    "top_k": 20,
    "top_p": 0.9,
    "tfs_z": 0.5,
    "typical_p": 0.7,
    "repeat_last_n": 33,
    "temperature": 0.8,
    "repeat_penalty": 1.2,
    "presence_penalty": 1.5,
    "frequency_penalty": 1.0,
    "mirostat": 1,
    "mirostat_tau": 0.8,
    "mirostat_eta": 0.6,
    "penalize_newline": true,
    "stop": ["\n", "user:"],
    "numa": false,
    "num_ctx": 1024,
    "num_batch": 2,
    "num_gpu": 1,
    "main_gpu": 0,
    "low_vram": false,
    "f16_kv": true,
    "vocab_only": false,
    "use_mmap": true,
    "use_mlock": false,
    "num_thread": 8
  }
}'

*/