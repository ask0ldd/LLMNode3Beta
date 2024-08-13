import { AIAgent } from "./AIAgent.js";
import { conversationistPrompt, skillRankingPrompt, skillsetGeneratorPrompt } from "./AIPsyPrompts.js";

class AISkillsetGeneratorAgent extends AIAgent{
    #job : string | undefined = undefined

    setTargetJob(job : string){
        this.#job = job
    }

    override async call(iter : number = 0) : Promise<string>{
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
}

export class AIPsyTeam{
    // !!! should mix own knowledge with whats found only?
    static requiredSkillsetGeneratorAgent = new AISkillsetGeneratorAgent("Skillset Generator").resetContext()
    .setSystemPrompt(skillsetGeneratorPrompt)

    static skillToQuestionTranslatorAgent = new AIAgent("Skill To Question Translator Agent").resetContext()
    .setSystemPrompt(skillToQuestionPrompt)

    static conversationistAgent = new AIAgent("Conversationist").resetContext()
    .setSystemPrompt(conversationistPrompt)

    static skillRankingAgent = new AIAgent("Skill Ranking Agent").resetContext()
    .setSystemPrompt(skillRankingPrompt)
}