import { SafeSearchType, search, SearchResult } from "duck-duck-scrape"
import * as cheerio from 'cheerio'

export class Browser {

    static async search(topic : string) : Promise<SearchResult[]>{
        const searchResults = await search(topic, {
            safeSearch: SafeSearchType.STRICT
        })
        
        return searchResults.results
    }

    static async fetchPage(url : string) : Promise<string| undefined>{
        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error(`Response status: ${response.status}`)
            const webpage = cheerio.load(await response.text())
            return webpage("main").text()
        }catch(error){
            console.log(error)
        }
    }
}