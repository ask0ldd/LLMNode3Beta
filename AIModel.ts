/**
 * @class AIModel
 * @description A class representing an AI model for generating text and embeddings.
 * @property {string} #modelName - The name of the AI model.
 * @property {boolean} #stream - Whether to stream the response or not.
 * @property {string} #systemPrompt - The system prompt for the AI model.
 * @property {Array<number>} #context - The context for the AI model.
 * @property {number} #contextSize - The size of the context for the AI model.
 */
class AIModel{

    #modelName : string
    #stream : boolean
    #systemPrompt : string
    #context : Array<number>
    #contextSize : number

    /**
     * @constructor
     * @param {Object} params - The parameters for the AI model.
     * @param {string} params.modelName - The name of the AI model.
     * @param {boolean} [params.stream=false] - Whether to stream the response or not.
     * @param {string} [params.systemPrompt='You are a helpful assistant.'] - The system prompt for the AI model.
     * @param {Array<number>} [params.context=[]] - The context for the AI model.
     * @param {number} [params.contextSize=0] - The size of the context for the AI model.
     */
    constructor({ modelName, stream = false, systemPrompt =  'You are a helpful assistant.', context = [], contextSize = 0 } : IAIModelParams){
        this.#modelName = modelName
        this.#stream = stream
        this.#systemPrompt = systemPrompt
        this.#context = context
        this.#contextSize = contextSize
    }

    /**
     * @async
     * @function ask
     * @param {string} prompt - The prompt for the AI model.
     * @returns {Promise<string>} The response from the AI model.
     * @description Sends a request to the AI model with the given prompt and returns the response.
     */
    async ask(prompt : string) : Promise<string> {
        const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: this.#buildRequest(prompt),
        });
        return response.json()
    }

    /**
     * @async
     * @function embeddings
     * @param {string} sequence - The sequence for which to generate embeddings.
     * @returns {Promise<string>} The embeddings for the given sequence.
     * @description Sends a request to generate embeddings for the given sequence and returns the embeddings.
     */
    async embeddings(sequence : string) : Promise<string> {
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
    setSystemPrompt(prompt : string) : void {
        this.#systemPrompt = prompt
    }

    /**
     * @function setModel
     * @param {string} modelName - The new name of the AI model.
     * @description Sets the name of the AI model.
     */
    setModel(modelName : string) : void {
        this.#modelName = modelName
    }

    /**
     * @function setContextSize
     * @param {number} value - The new size of the context for the AI model.
     * @description Sets the size of the context for the AI model.
     */
    setContext(context : Array<number>) : void {
        this.#context = context
    }

    /**
     * @function setContextSize
     * @param {number} value - The new size of the context for the AI model.
     * @description Sets the size of the context for the AI model.
     */
    setContextSize(value : number) : void {
        this.#contextSize = value
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
        if(this.#contextSize != 0) baseRequest = {...baseRequest, "options": { "num_ctx": this.#contextSize }}
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
}

interface IAIModelParams{
    modelName : string
    stream : boolean
    systemPrompt : string
    context : Array<number>
    contextSize : number
}

interface IBaseOllamaRequest{
    model: string
    stream: boolean
    system: string
    prompt: string
    context : Array<number>
    options? : any
}