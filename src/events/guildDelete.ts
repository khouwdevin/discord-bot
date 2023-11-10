import { Guild } from "discord.js";
import GuildModel from "../schemas/Guild";
import { BotEvent } from "../types";
import mongoose from "mongoose";

const event: BotEvent = {
    name: "guildDelete",
    execute: (guild : Guild) => {
        if (mongoose.connection.readyState === 0) return 
        
        GuildModel.deleteOne({ guildID: guild.id }).catch((message) => console.log(message))
    }
}

export default event;