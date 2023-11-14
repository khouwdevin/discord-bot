import { VoiceState } from "discord.js";
import { BotEvent } from "../types";
import DetectPresence from "../voiceStateFunctions/detectPresence";
import DetectUser from "../voiceStateFunctions/detectUser";

const event: BotEvent = {
    name: "voiceStateUpdate",
    execute: async (oldstate: VoiceState, newstate: VoiceState) => {
        if (newstate.channelId === null) {
            DetectPresence(oldstate, 0)
        }
        else if (oldstate.channelId === null){
            DetectPresence(newstate, 1)
        }
        else {
            DetectPresence(newstate, 2)
        }

        DetectUser(oldstate, newstate)
    }
}

export default event