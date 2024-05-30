class PromptTemplate {
    #role = "You are a helpful assistant." // You are developer working at a big tech company with a PHD in computer science.
    #task : string = "" // do this
    #taskHandlingInstructions : string | null = "" // what you expect out of the task, how the task should be tackled, ... 
    #emotionStimulus : string | null =  "" // do your best my job is on the line.
    #chainOfThought : string[] = [] // describe the process step by step to help the model
    #fewShot : string[] = [] // provide examples to guide the model to the expected results, great to inforce formatting and structure
    
    constructor({role = null, task, taskHandlingInstructions = null, emotionStimulus = null, chainOfThought = null, fewShot = null} : IPromptTemplateParameters){
        this.#role = role ? role : "You are a helpful assistant."
        this.#task = task
        this.#taskHandlingInstructions = taskHandlingInstructions ? taskHandlingInstructions : null
        this.#emotionStimulus = emotionStimulus ? emotionStimulus : null
        this.#chainOfThought = chainOfThought ? chainOfThought : []
        this.#fewShot = fewShot ? fewShot : []
    }
}

interface IPromptTemplateParameters{
    role? : string | null
    task : string
    taskHandlingInstructions? : string | null
    emotionStimulus? : string | null
    chainOfThought? : string[] | null
    fewShot? : string[] | null
}


/*
Step-back prompting : For example, instead of directly asking "Which school did Estella Leopold attend from August to November 1954?", 
the step-back prompt would be "What is the educational history of Estella Leopold?". By first establishing her overall educational background, 
sthe LLM can then pinpoint the specific timeframe asked about in the original query.
*/

// can sometimes use "step by step" instead of listing the steps
