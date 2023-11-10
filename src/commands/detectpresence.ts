import { Command } from "../types";
import { sendTimedMessage, setGuildOption } from "../functions";
import { TextChannel } from "discord.js";

const command: Command = {
    name: "detectpresence",
    execute: async (message, args) => {
        try {
            const detectpresence = args[1]

            if (!detectpresence) return message.channel.send("No status is provided!")
            if (detectpresence !== "true" && detectpresence !== "false") return message.channel.send("Please provide only true or false!")
            if (!message.guild) return message.channel.send("Some error is occured!")

            setGuildOption(message.guild, "detectpresence", detectpresence === "true")
            
            sendTimedMessage("Detect presence successfully changed!", message.channel as TextChannel, 5000)
        } catch {}
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: ["dp"]
}

export default command