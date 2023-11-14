import { Command } from "../types";
import { color, setGuildOption } from "../functions";
import { EmbedBuilder } from "discord.js";

const command: Command = {
    name: "detectpresence",
    execute: async (message, args) => {
        try {
            const detectpresence = args[1]
            const channel = message.channel
        
            if (!detectpresence) return message.channel.send("No status is provided!")
            if (detectpresence !== "true" && detectpresence !== "false") return message.channel.send("Please provide only true or false!")
            if (!message.guild) {
                return message.channel.send("Some error is occured!")
            }

            setGuildOption(message.guild, "detectpresence", detectpresence === "true")
            
            const embed = new EmbedBuilder()
                .setAuthor({ name: "Detect Presence", iconURL: message.client.user.avatarURL() || undefined })
                .setFields({ name: " ", value: `Detect presence successfully changed to **${detectpresence}**!` })
                .setColor("Blurple")
            channel.send({ embeds: [embed] })
        } catch(e) {console.log(color("text", `❌ Failed to configure detect presence : ${color("error", e.message)}`))}
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: ["dp"]
}

export default command