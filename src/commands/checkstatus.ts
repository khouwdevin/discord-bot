import { EmbedBuilder } from "discord.js";
import { Command } from "../types";
import { color, getAllGuildOption } from "../functions";

const command : Command = {
    name: "checkstatus",
    execute: async (message, args) => {
        try {
            if (!message.guild) return

            const guildoptions = await getAllGuildOption(message.guild)
            if (!guildoptions) return
            
            const options = guildoptions
    
            const statuslist = 
                `
                **detect presence**: ${options?.detectpresence}\r
                **notify**: ${options?.notify}\r
                **channel**: <#${options?.channel}>
                `
    
            const embed = new EmbedBuilder()
                .setTitle("Here's the list")
                .setColor("Blurple")
                .addFields(
                    { name: "Status List", value: " "},
                    { name: " ", value: statuslist }
                )
            message.channel.send({ embeds: [embed] })
        } catch(e) {console.log(color("text", `❌ Failed to show check status : ${color("error", e.message)}`))}
    },
    cooldown: 5,
    aliases: ["cs"],
    permissions: []
}

export default command