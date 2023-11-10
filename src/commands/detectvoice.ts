import { Command } from "../types";
import { sendTimedMessage, setGuildOption } from "../functions";
import { TextChannel } from "discord.js";
import mongoose from "mongoose";

const command: Command = {
    name: "detectvoice",
    execute: async (message, args) => {
        try {
            if (mongoose.connection.readyState === 0) return
            
            let detectvoice = args[1]
        
            if (!detectvoice) return message.channel.send("No status is provided!")
            if (detectvoice !== "true" && detectvoice !== "false") return message.channel.send("Please provide only true or false!")
            if (!message.guild) {
                return message.channel.send("Some error is occured!")
            }

            setGuildOption(message.guild, "detectvoice", detectvoice === "true")
            

            sendTimedMessage("Detect voice successfully changed!", message.channel as TextChannel, 5000)
        } catch {}
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: ["dv"]
}

export default command