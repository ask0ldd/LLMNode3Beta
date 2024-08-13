import { AIPsyTeam } from "./AIPsyTeam";

// !!! should chat to ask rh a description of the position instead of it being hardcoded
const requiredSkillset = AIPsyTeam.requiredSkillsetGeneratorAgent
    .setRequest("Tech Lead in a company branch dealing with the frontend of a social media plateform")
    .call()