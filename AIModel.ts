/**
 * @class AIModel
 * @description A class representing an AI model for generating text and embeddings.
 * @property {string} #modelName - The name of the AI model.
 * @property {boolean} #stream - Whether to stream the response or not.
 * @property {string} #systemPrompt - The system prompt for the AI model.
 * @property {number[]} #context - The context for the AI model.
 * @property {number} #contextSize - The size of the context for the AI model.
 */
export class AIModel{

    #modelName : string
    #stream : boolean
    #systemPrompt : string
    #context : number[]
    #contextSize : number
    #temperature : number
    // #knowledgeSource = ""

    /**
     * @constructor
     * @param {Object} params - The parameters for the AI model.
     * @param {string} params.modelName - The name of the AI model.
     * @param {boolean} [params.stream=false] - Whether to stream the response or not.
     * @param {string} [params.systemPrompt='You are a helpful assistant.'] - The system prompt for the AI model.
     * @param {number[]} [params.context=[]] - The context for the AI model.
     * @param {number} [params.contextSize=2048] - The size of the context for the AI model.
     * @param {number} [params.temperature=0.8] - The temperature for the AI model.
     */
    constructor({ modelName = "dolphin-llama3:8b-256k", stream = false, systemPrompt =  'You are a helpful assistant.', context = [], contextSize = 2048, temperature = 0.8 } : IAIModelParams){
        this.#modelName = modelName
        this.#stream = stream
        this.#systemPrompt = systemPrompt
        this.#context = context
        this.#contextSize = contextSize
        this.#temperature = temperature
    }

    /**
     * @async
     * @function ask
     * @param {string} prompt - The prompt for the AI model.
     * @returns {Promise<ICompletionResponse>} The response from the AI model.
     * @description Sends a request to the AI model with the given prompt and returns the response.
     */
    async ask(prompt : string, streaming = false) : Promise<ICompletionResponse> {
        const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: this.#buildRequest(prompt),
        });

        return await response.json()
    }

     async askForAStreamedResponse(prompt : string) : Promise<ReadableStreamDefaultReader<Uint8Array>>{
        const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: this.#buildRequest(prompt),
        });

        const reader = response.body?.getReader()
        if (!reader) {
            throw new Error("Failed to read response body.")
        }
        return reader
    }

    /**
     * @async
     * @function embeddings
     * @param {string} sequence - The sequence for which to generate embeddings.
     * @returns {Promise<IEmbeddingResponse>} The embeddings for the given sequence.
     * @description Sends a request to generate embeddings for the given sequence and returns the embeddings.
     */
    async embeddings(sequence : string) : Promise<IEmbeddingResponse> {
        const response = await fetch("http://127.0.0.1:11434/api/embeddings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: this.#buildEmbeddingRequest(sequence),
        });
        return response.json()
    }

    /**
     * @function setSystemPrompt
     * @param {string} prompt - The new system prompt for the AI model.
     * @description Sets the system prompt for the AI model.
     */
    setSystemPrompt(prompt : string) : AIModel {
        this.#systemPrompt = prompt
        return this
    }

    /**
     * @function setModel
     * @param {string} modelName - The new name of the AI model.
     * @description Sets the name of the AI model.
     */
    setModel(modelName : string) : AIModel {
        this.#modelName = modelName
        return this
    }

    /**
     * @function setContextSize
     * @param {number} value - The new size of the context for the AI model.
     * @description Sets the size of the context for the AI model.
     */
    setContext(context : number[]) : AIModel {
        this.#context = context
        return this
    }

    /**
     * @function setContextSize
     * @param {number} value - The new size of the context for the AI model.
     * @description Sets the size of the context for the AI model.
     */
    setContextSize(value : number) : AIModel {
        if(value < 0) value = 0
        this.#contextSize = value
        return this
    }

    /**
     * @function setTemperature
     * @param {number} value - The new temperature for the AI model.
     * @description Sets the temperature for the AI model.
     */
        setTemperature(value : number) : AIModel {
            if(value > 1) value = 1
            if(value < 0) value = 0
            this.#temperature = value
            return this
    }

    /**
     * @private
     * @function #buildRequest
     * @param {string} prompt - The prompt for the AI model.
     * @returns {string} The request body for the AI model.
     * @description Builds the request body for the AI model with the given prompt and other parameters.
     */
    #buildRequest(prompt : string) : string {
        let baseRequest : IBaseOllamaRequest = {
            "model": this.#modelName,
            "stream": this.#stream,
            "system": this.#systemPrompt,
            "prompt": prompt,
            "context" : this.#context
        }
        // if(this.#contextSize != 0) baseRequest = {...baseRequest, "options": { "num_ctx": this.#contextSize }}
        baseRequest = {...baseRequest, "options": { "num_ctx": this.#contextSize, "temperature" : this.#temperature }}
        return JSON.stringify(baseRequest)
    }

    /**
     * @private
     * @function #buildEmbeddingRequest
     * @param {any} sequence - The sequence for which to generate embeddings.
     * @returns {string} The request body for generating embeddings.
     * @description Builds the request body for generating embeddings for the given sequence.
     */
    #buildEmbeddingRequest (sequence : any) : string {
        return JSON.stringify({
            "model": /*"mxbai-embed-large"*/ "nomic-embed-text",
            "prompt": sequence,
            /*"stream": false,*/
        })
    }

    /*use(knowledgeSource : string){
        this.#knowledgeSource = knowledgeSource
    }

    toAnswer(question : string){
        if(this.#knowledgeSource == "") return this.ask(question)
        
    }*/

    enableStreaming(){
        this.#stream = true
    }

    disableStreaming(){
        this.#stream = false
    }
}

export interface IAIModelParams{
    modelName? : string
    stream? : boolean
    systemPrompt? : string
    context? : number[]
    contextSize? : number
    temperature? : number
}

export interface IBaseOllamaRequest{
    model: string
    stream: boolean
    system: string
    prompt: string
    context : number[]
    options? : any
}

export type Embedding = number[]

export interface IEmbeddingResponse {
    embedding : Embedding
}

export interface ICompletionResponse{
    model: string
    created_at: string
    response: string
    done: boolean
    context?: number[]
    total_duration?: number
    load_duration?: number
    prompt_eval_count?: number
    prompt_eval_duration?: number
    eval_count?: number
    eval_duration?: number
}