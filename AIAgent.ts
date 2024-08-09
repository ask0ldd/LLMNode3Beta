import { AIModel } from "./AIModel"

export class AIAgent {

    #name! : string
    #maxIter = 25
    #model! : AIModel
    #fnCallingModel : AIModel | null = null
    #request = ""

    models = ["llama3", "llama3.1:8b", "dolphin-llama3:8b-256k", "phi3:3.8-mini-128k-instruct-q4_K_M", "qwen2", "qwen2:1.5b", "qwen2:0.5b", "gemma2:9b"]

    defaultModel = "llama3.1:8b"


    constructor(name : string, model : string = this.defaultModel){
        this.#name = name
        this.#model = new AIModel({modelName : model}).setTemperature(0.1).setContextSize(8000).setContext([]).setSystemPrompt("You are an helpful assistant.")
    }

    setModel(model : AIModel) : AIAgent{
        this.#model = model
        return this
    }

    get model() : AIModel{
        return this.#model
    }

    async call(){
        if(this.#request == "") return
        const response = await this.#model.ask(this.#request)
        console.log(response.response)
    }

    setRequest(request : string) : AIAgent{
        this.#request = request
        return this
    }

    setMaxIter(iter : number) : AIAgent{
        this.#maxIter = iter
        return this
    }

    setFunctionCallingModel(model : AIModel){
        this.#fnCallingModel = model
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