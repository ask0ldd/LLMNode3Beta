import { AIModel } from "./AIModel.js"

export class AIAgent {

    #name! : string
    #maxIter = 5
    #model! : AIModel
    #request = ""
    #lastOutput = ""
    #regexValidator : RegExp | undefined

    models = ["llama3", "llama3.1:8b", "dolphin-llama3:8b-256k", "phi3:3.8-mini-128k-instruct-q4_K_M", "qwen2", "qwen2:1.5b", "qwen2:0.5b", "gemma2:9b"]

    defaultModel = "llama3.1:8b"

    /**
     * Constructs a new AIAgent.
     * @param {string} name - The name of the agent.
     * @param {string} [model="llama3.1:8b"] - The model to be used by the agent.
     */
    constructor(name : string, model : string = "llama3.1:8b"){
        this.#name = name
        this.#model = new AIModel({modelName : model}).setTemperature(0.1).setContextSize(8000).setContext([]).setSystemPrompt("You are an helpful assistant.")
    }

    /**
     * Sets the AI model for the agent.
     * @param {AIModel} model - The AI model to set.
     * @returns {AIAgent} The current instance for chaining.
     */
    setModel(model : AIModel) : AIAgent{
        this.#model = model
        return this
    }

    /**
     * Gets the current AI model.
     * @returns {AIModel} The current AI model.
     */
    get model() : AIModel{
        return this.#model
    }

    /**
     * Calls the AI model with the current request.
     * @returns {Promise<string>} The response from the AI model.
     */
    async call(iter : number = 0) : Promise<string>{
        let currentIter = iter
        if(this.#request == "") throw new Error("Request is missing.")
        const response = await this.#model.ask(this.#request)
        this.#log(response.response)
        this.#lastOutput = response.response
        if(this.#regexValidator == undefined) return response.response
        if(this.checkOutputValidity(response.response, this.#regexValidator)) return response.response
        if(currentIter+1 < this.#maxIter) return this.call(currentIter + 1)
        throw new Error(`Couldn't format the reponse the right way despite the ${this.#maxIter} iterations.`)
    }

    checkOutputValidity(output : string, regex : RegExp) : boolean{
        return regex.test(output)
    }

    #log(text : string){
        console.log("\n\n\u001b[1;35m" + this.#name + ' :\n\u001b[1;36m' + text)
    }

    /**
     * Sets the request for the AI model.
     * @param {string} request - The request to be set.
     * @returns {AIAgent} The current instance for chaining.
     */
    setRequest(request : string) : AIAgent{
        this.#request = request
        return this
    }

    setTemperature(temp : number){
        this.model.setTemperature(temp)
        return this
    }

    /**
     * Sets the system prompt for the AI model.
     * @param {string} prompt - The system prompt to be set.
     * @returns {AIAgent} The current instance for chaining.
     */
    setSystemPrompt(prompt : string) : AIAgent{
        this.#model.setSystemPrompt(prompt)
        return this
    }

    /**
     * Resets the context of the AI model.
     * @returns {AIAgent} The current instance for chaining.
     */
    resetContext(): AIAgent{
        this.#model.setContext([])
        return this
    }

    /**
     * Sets the maximum number of iterations.
     * @param {number} iter - The maximum number of iterations.
     * @returns {AIAgent} The current instance for chaining.
     */
    setMaxIter(iter : number) : AIAgent{
        this.#maxIter = iter
        return this
    }

    setRegexOutputValidator(regex : RegExp){
        this.#regexValidator = regex
        return this
    }

    /**
     * Sets the function calling model.
     * @param {AIModel} model - The function calling model to set.
     */
    /*setFunctionCallingModel(model : AIModel){
        this.#fnCallingModel = model
    }*/

    /**
     * Sets the expected input format.
     * @param {string} fewShots - The expected input format.
     * @returns {AIAgent} The current instance for chaining.
     */
    /*setExpectedInputFormat(fewShots : string){
        this.#expectInputFormat = fewShots
        return this
    }*/

    /**
     * Gets the expected input format.
     * @returns {string} The expected input format.
     */
    /*getExpectedInputFormat(){
        return this.#expectInputFormat
    }*/

    getRequest() : string{
        return this.#request
    }

    getModel() : AIModel{
        return this.#model
    }

    getLog() : (text : string) => void {
        return this.#log
    }

    getMaxIter() : number{
        return this.#maxIter
    }

    getLastOutput() : string{
        return this.#lastOutput
    }

    getRegexValidator() : RegExp | undefined{
        return this.#regexValidator
    }

    setLastOutput(lastOutput : string) : void{
        this.#lastOutput = lastOutput
    }

    //setAction
    //setOutputSchema
}

// should be able to link a control agent

export interface IAIAgentParams{
    name : string
    model : AIModel
}

/*
Agent Attributes
Attribute	Description
Role	Defines the agent's function within the crew. It determines the kind of tasks the agent is best suited for.
Goal	The individual objective that the agent aims to achieve. It guides the agent's decision-making process.
Backstory	Provides context to the agent's role and goal, enriching the interaction and collaboration dynamics.
LLM (optional)	Represents the language model that will run the agent. It dynamically fetches the model name from the OPENAI_MODEL_NAME environment variable, defaulting to "gpt-4" if not specified.
Tools (optional)	Set of capabilities or functions that the agent can use to perform tasks. Expected to be instances of custom classes compatible with the agent's execution environment. Tools are initialized with a default value of an empty list.
Function Calling LLM (optional)	Specifies the language model that will handle the tool calling for this agent, overriding the crew function calling LLM if passed. Default is None.
Max Iter (optional)	The maximum number of iterations the agent can perform before being forced to give its best answer. Default is 25.
Max RPM (optional)	The maximum number of requests per minute the agent can perform to avoid rate limits. It's optional and can be left unspecified, with a default value of None.
max_execution_time (optional)	Maximum execution time for an agent to execute a task It's optional and can be left unspecified, with a default value of None, menaning no max execution time
Verbose (optional)	Setting this to True configures the internal logger to provide detailed execution logs, aiding in debugging and monitoring. Default is False.
Allow Delegation (optional)	Agents can delegate tasks or questions to one another, ensuring that each task is handled by the most suitable agent. Default is True.
Step Callback (optional)	A function that is called after each step of the agent. This can be used to log the agent's actions or to perform other operations. It will overwrite the crew step_callback.
Cache (optional)	Indicates if the agent should use a cache for tool usage. Default is True.
*/