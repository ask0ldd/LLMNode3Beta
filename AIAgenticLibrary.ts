import { AIAgent } from "./AIAgent.js";
import { codeExtractorPrompt, newLineFormatterPrompt, planAssessorPrompt, searchQueryProducerPrompt, textExtractorPrompt } from "./AIOtherPrompts.js";

export class AIAgenticLibrary{

    static formatterAgent = new AIAgent("New Line Formatter Agent").resetContext()
        .setSystemPrompt(newLineFormatterPrompt)

    static textExtractorAgent = new AIAgent("Text Extractor Agent").resetContext()
    .setSystemPrompt(
        /*`You are a expert linguist and you should process any chunk of text that way :\n
        - Extract all the prose out of it.\n
        - Output it with as little modifications as possible.\n
        - Add no annotations or delimiters to your output.\n\n
        Here follows the text to format : \n\n`*/
        textExtractorPrompt
    )

    static codeExtracterAgent = new AIAgent("Code Extracter Agent").resetContext()
        .setSystemPrompt(codeExtractorPrompt)

    static planAssessorAgent = new AIAgent("Plan Assessor Agent").resetContext()
    .setSystemPrompt(planAssessorPrompt)

    static searchQueryProducerAgent = new AIAgent("SearchQueryProducerAgent").setTemperature(0.3).resetContext()
    .setSystemPrompt(searchQueryProducerPrompt)
}

/*

Prompting

This will but added to the output despite being in the system prompt
    Now i want to stress this :\n
    - Don't try to be creative.\n
    - Follow this asked process and output the text with the added new lines.\n
    - Don't do anything more than this formatting like adding annotations or delimiters.

*/

// - Add to the result array all the tasks or steps missing to the reach the goal and give it a notation of 2. 2 always overrides 1 when the task was missing from "the plan".\n\n