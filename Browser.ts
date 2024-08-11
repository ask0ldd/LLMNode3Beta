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
            webpage('script').remove()
            webpage('style').remove()
            webpage('nav').remove()
            webpage('header').remove()
            webpage('footer').remove()
            webpage('a').remove()
            webpage('img').remove()
            const cleanText = (webpage("body").text()).replace("\n", "")
            return cleanText
        }catch(error){
            console.log(error)
        }
    }
}