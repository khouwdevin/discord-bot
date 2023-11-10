import { TextChannel, VoiceState } from "discord.js";
import { BotEvent } from "../types";
import { getGuildOption, notifyToConfigDefaultTextChannel, sendMessage, sendTimedMessageToExistingChannel } from "../functions";
import DetectPresence from "../voiceState/detectPresence";
import DetectUser from "../voiceState/detectUser";
import mongoose from "mongoose";

const event: BotEvent = {
    name: "voiceStateUpdate",
    execute: async (oldstate: VoiceState, newstate: VoiceState) => {
        if (newstate.channelId === null) {
            const lavalink = process.env.LAVALINK_HOST

            if(mongoose.connection.readyState === 0) DetectPresence(oldstate, 0)
            if (lavalink) DetectUser(oldstate, 0)
        }
        else if (oldstate.channelId === null){
            const lavalink = process.env.LAVALINK_HOST

            if(mongoose.connection.readyState === 0) DetectPresence(newstate, 1)
            if (lavalink) DetectUser(newstate, 1)
        }
    }
}

export default event