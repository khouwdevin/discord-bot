import { Command } from "../types";
import { sendTimedMessage, setGuildOption } from "../functions";
import { TextChannel } from "discord.js";
import mongoose from "mongoose";

const command: Command = {
    name: "notify",
    execute: async (message, args) => {
        try {
            if (mongoose.connection.readyState === 0) return
            
            let notify = args[1]
        
            if (!notify) return message.channel.send("No status is provided")
            if (notify !== "true" && notify !== "false") return message.channel.send("Please provide only true or false!")
            if (!message.guild) {
                return message.channel.send("Some error is occured!")
            }

            setGuildOption(message.guild, "notify", notify === "true")

            sendTimedMessage("Notify successfully changed!", message.channel as TextChannel, 5000)
        } catch {}
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: ["n"]
}

export default command