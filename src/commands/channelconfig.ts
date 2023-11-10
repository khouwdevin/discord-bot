import { Command } from "../types";
import { sendTimedMessage, setGuildOption } from "../functions";
import { TextChannel } from "discord.js";
import mongoose from "mongoose";

const command: Command = {
    name: "channelconfig",
    execute: async (message, args) => {
        try {
            if (mongoose.connection.readyState === 0) return
            
            const channelid = args[1]
            const channel = message.channel

            if (!channelid) return message.channel.send("No channel is provided!")

            if (!message.guild?.channels.cache.find((c) => c.id === channelid)) {
                return sendTimedMessage("Channel not found! Please provide an existing text channel!", channel as TextChannel, 10000)
            }

            if (!message.guild) {
                return sendTimedMessage("Some error is occured!", channel as TextChannel, 5000)
            }

            setGuildOption(message.guild, "channel", channelid)

            sendTimedMessage("Channel config successfully changed!", channel as TextChannel, 5000)
        } catch {}
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: ["cfg"]
}

export default command