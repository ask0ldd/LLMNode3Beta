import { AIAgent } from "./AIAgent";

class AIQueue{

    #queue : AIAgent[] = []

    pull(){
        if(this.#queue.length == 0) return
        return this.#queue.shift()
    }

    next(){
        return this.#queue[0]
    }
}