import { AIAgent } from "./AIAgent";

class AIChain{
    agents : AIAgent[] = []
    #index = 0
    state = {}

    pushAgent(agent : AIAgent){
        this.agents.push(agent)
    }

    async next(previousAgenceResponse?: string){
        this.#index++
        const response = await this.agents[this.#index].rawCall()
        console.log(JSON.stringify(response))
    }

    restart(){
        this.#index = 0
    }

    resolve(){
        this.restart()
        while(this.#index++ < this.agents.length){
            this.next()
        }
    }
}