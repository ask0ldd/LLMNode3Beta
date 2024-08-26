export class AIEmbeddingModel{
    static #buildEmbeddingRequest (sequence : any, model : string = "nomic-embed-text") : string {
        return JSON.stringify({
            "model": model,
            "prompt": sequence,
        })
    }

    static async process(sequence : string, model : string = "nomic-embed-text") : Promise<IEmbeddingResponse> {
        const response = await fetch("http://127.0.0.1:11434/api/embeddings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: this.#buildEmbeddingRequest(sequence, model),
        });
        return response.json()
    }
}

export type Embedding = number[]

export interface IEmbeddingResponse{
    embedding : Embedding
}