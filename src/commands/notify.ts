import { Command } from "../types";
import { color, setGuildOption } from "../functions";
import { EmbedBuilder } from "discord.js";

const command: Command = {
    name: "notify",
    execute: async (message, args) => {
        try {
            const notify = args[1]
            const channel = message.channel
        
            if (!notify) return message.channel.send("No status is provided")
            if (notify !== "true" && notify !== "false") return message.channel.send("Please provide only true or false!")
            if (!message.guild) {
                return message.channel.send("Some error is occured!")
            }

            setGuildOption(message.guild, "notify", notify === "true")

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${process.env.BOT_NAME} Notify`, iconURL: message.client.user.avatarURL() || undefined })
                .setFields({ name: " ", value: `Channel config successfully changed  to **${notify}**!` })
                .setColor("Blurple")
            channel.send({ embeds: [embed] })
        } catch(e) {console.log(color("text", `❌ Failed to configure notify : ${color("error", e.message)}`))}
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: ["n"]
}

export default command