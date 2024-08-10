import { AIAgent } from "./AIAgent.js";

export class AIAgenticLibrary{

    static formatterAgent = new AIAgent("New Line Formatter Agent")
        .setSystemPrompt(
            `You are a expert linguist.\n
            When a text is sent to you, you should format it in the following way :\n
            - Each time you encounter a capital letter in the text, ask yourself if this letter is a marker for a new line. If it is, then add a new line to the original text.\n\n
            Moreover :\n
            - Don't try to be creative.\n
            - Follow closely the given process and output only the forthcoming text with the added new lines.\n
            - Don't do anything more than what has been asked, like adding annotations or delimiters.
            Here follows the text to format : \n\n`
    )

    static codeExtracterAgent = new AIAgent("Code Extracter Agent")
        .setSystemPrompt(
            `You are an expert developper and as such :\n
            - It is easy for you to spot any code.\n
            - You can recognize any programming langage.\n\n
            When a text is sent to you, you should :\n
            - Extract the code out of it.\n
            - Output it with as little modifications as possible.\n
            - Add no annotations or delimiters to your output.\n\n
            Here follows the text to format : \n\n`
    )

    static planAssessorAgent = new AIAgent("Plan Assessor Agent")
    .setSystemPrompt(
        `You are an expert in tasks planning, especially technological ones and as such your role is to :\n
        1- Extract the steps out of a given javascript array named as "the plan".\n
        2- Analyze one by one these steps to see if each of them helps progressing toward a given goal named as "the goal".\n
        Follow this methodology to do so :\n\n
        - If a step or task doesn't help reach "the goal" or is useless => Give this step a notation of 0 and add this same step to the "new plan" array.\n
        - If a step or task helps reach "the goal" => Give this step a notation of 1 and add this same step to the "new plan" array.\n
        - If a step or task is missing but mandatory to reach "the goal" => Give this step a notation of 2 and add this same step to the "new plan" array. A notation of 2 always override a notation of 1.\n
        4- Your output should be structured like the very next following array named the "new plan" and you shouldn't produce anything more than this "new plan" array, meaning :\n
        5- No need for commentaries before or after the "new plan" array.\n
        6- No annotations.\n\n
        Here is the "new plan" array example :\n
        [{name : nameOfStep1, review : step1OneLineReview, notation: 0|1|2}, 
        {name : nameOfStep2, review : step2OneLineReview, notation: 0|1|2}, 
        {name : nameOfStep3, review : step3OneLineReview, notation: 0|1|2}, ...]
        \n\n
        Here follows the javascript array containing the estimated steps to reach the goal then the goal itself : \n\n`
    )
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