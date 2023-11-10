import { Guild } from "discord.js";
import GuildModel from "../schemas/Guild";
import { BotEvent } from "../types";
import mongoose from "mongoose";

const event: BotEvent = {
    name: "guildCreate",
    execute: (guild : Guild) => {
        if (mongoose.connection.readyState === 0) return 

        const channelid = guild.systemChannel ? guild.systemChannel.id : "default"

        const newGuild = new GuildModel({
            guildID: guild.id,
            options: {
                detectvoice: false,
                notify: false,
                channel: channelid
            },
            joinedAt: Date.now()
        })
        newGuild.save()
    }
}

export default event;