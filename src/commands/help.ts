import { EmbedBuilder, TextChannel } from "discord.js";
import { Command } from "../types";
import { deleteTimedMessage } from "../functions";

const command : Command = {
    name: "help",
    execute: async (message, args) => {
        try {
            const prefix = process.env.PREFIX_COMMAND
            const botname = process.env.BOT_NAME

            const commandslist = 
                `
                **${prefix}channelconfig**: If you want to change ${botname}'s channel (send the channel id).\r
                example => **'${prefix}channelconfig 12344556677'** or **'${prefix}cfg 12344556677'**\r
                **${prefix}checkstatus**: If you want to check ${botname}'s config.\r
                example => **'${prefix}checkstatus'** or **'${prefix}cs'**\r
                **${prefix}detectvoice**: If you want to disable or enable detect voice.\r
                example => **'${prefix}detectvoice false'** or **'${prefix}dv false'**\r
                **${prefix}greet**: ${botname} will greet you!\r
                example => **'${prefix}greet'** or **'${prefix}g'**\r
                **${prefix}notify**: If you want to disable or enable ${botname} online notif.\r
                example => **'${prefix}notify false'** or **'${prefix}n false'**
                `

            const commandsMusicList = 
                `
                **${prefix}play**: to play and search song.\r
                example => **'${prefix}play drown'** or **'${prefix}p drown'**\r
                **${prefix}pause**: to pause song.\r
                example => **'${prefix}pause'** or **'${prefix}ps'**\r
                **${prefix}resume**: to resume song.\r
                example => **'${prefix}resume'** or **'${prefix}rsm'**\r
                **${prefix}skip**: to skip song.\r
                example => **'${prefix}skip'** or **'${prefix}s'**\r
                **${prefix}stop**: to stop player.\r
                example => **'${prefix}stop'** or **'${prefix}stp'**\r
                `

            const slashcommandslist = 
                `
                **/afk**: to announce your afk status\r
                **/clear**: to clear messages\r
                **/decode**: to decode your secret code\r
                **/embed**: to create embed message\r
                **/event**: to add discord schedule event\r
                **/ping**: to test bot ping\r
                **/poll**: to create poll\r
                `

            const embed = new EmbedBuilder()
                .setTitle("Here's the instruction")
                .setColor("White")
                .addFields(
                    { name: "Slash Commands List", value: slashcommandslist},
                    { name: "Commands List", value: commandslist},   
                    { name: "Music Commands List", value: commandsMusicList},   
                )
            message.channel.send({ embeds: [embed] }).then(m => {
                deleteTimedMessage(m, message.channel as TextChannel, 20000)
                deleteTimedMessage(message, message.channel as TextChannel, 20000)
            })
        } catch(e) {console.log(e)}
    },
    cooldown: 2,
    aliases: ["h"],
    permissions: []
}

export default command