import { AIAgent } from "./AIAgent";

class AIChain{
    agents : AIAgent[] = []
    #index = 0

    pushAgent(agent : AIAgent){
        this.agents.push(agent)
    }

    next(value : string){
        this.#index++
    }

    restart(){
        this.#index = 0
    }
}