import { AIAgent } from "./AIAgent.js";
import { conversationistPrompt, jobExtractorPrompt, SkillAssessementQuestionsSortingPrompt, skillRankingPrompt, skillsetGeneratorPrompt, skillToQuestionsPrompt } from "./AIPsyPrompts.js";

class AISkillsetGeneratorAgent extends AIAgent{
    #job : string | undefined = undefined

    setTargetJob(job : string){
        this.#job = job
    }

    override async call(iter : number = 0) : Promise<string>{
        let currentIter = iter
        if(this.getRequest() == "") throw new Error("Request is missing.")
        const response = await this.getModel().ask(this.getRequest())
        this.getLog()(response.response)
        this.setLastOutput(response.response)
        if(this.getRegexValidator() == undefined) return response.response
        if(this.checkOutputValidity(response.response, this.getRegexValidator() as RegExp)) return response.response
        if(currentIter+1 < this.getMaxIter()) return this.call(currentIter + 1)
        throw new Error(`Couldn't format the reponse the right way despite the ${this.getMaxIter()} iterations.`)
    }
}

export class AIPsyTeam{

    static jobExtractorAgent = new AIAgent("Job Extractor Agent").resetContext().setTemperature(0.3)
    .setSystemPrompt(jobExtractorPrompt)

    // !!! should mix own knowledge with whats found only?
    static requiredSkillsetGeneratorAgent = new AIAgent("Skillset Generator").resetContext().setTemperature(0.6)
    .setSystemPrompt(skillsetGeneratorPrompt)

    static skillToQuestionsTranslatorAgent = new AIAgent("Skill To Question Translator Agent").resetContext().setTemperature(0.6)
    .setSystemPrompt(skillToQuestionsPrompt)

    static conversationistAgent = new AIAgent("Conversationist").resetContext()
    .setSystemPrompt(conversationistPrompt)

    /*static skillRankingAgent = new AIAgent("Skill Ranking Agent").resetContext()
    .setSystemPrompt(skillRankingPrompt)*/

    static skillAssessmentQuestionsRankingAgent = new AIAgent("Skill Assessment Questions Ranking Agent").resetContext()
    .setSystemPrompt(SkillAssessementQuestionsSortingPrompt)
}