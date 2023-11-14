import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { Command, IHelp } from "../types";
import { color } from "../functions";

const command : Command = {
    name: "help",
    execute: async (message, args) => {
        try {
            const client = message.client

            const embed = new EmbedBuilder()
                .setTitle(commandText[0].title)
                .setColor("Orange")
                .setFields(commandText[0].field)
                .setFooter(commandText[0].footer)

            const currentMessage = await message.channel.send({ embeds: [embed] })

            const backButton = new ButtonBuilder()
                .setLabel("⬅️")
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`help.${currentMessage.id}.back`)

            const nextButton = new ButtonBuilder()
                .setLabel("➡️")
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`help.${currentMessage.id}.next`)

            const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(backButton, nextButton)
            
            await currentMessage.edit({ embeds: [embed], components: [buttonsRow] })

            const timeout = setTimeout( async () => {
                await currentMessage.delete()
                    .catch((e) => console.log(color("text", `❌ Failed to delete message : ${color("error", e.message)}`)))
            }, 20000)

            client.timeouts.set(`help-${currentMessage.id}`, timeout)
        } catch(e) {console.log(color("text", `❌ Failed to show help : ${color("error", e.message)}`))}
    },
    button: async (interaction) => {
        try {
            if (!interaction.channel) return

            const [type, messageId, command] = interaction.customId.split(".")
            const client = interaction.client
            const currentMessage = await interaction.channel.messages
                .fetch(messageId)
                .catch((e) => console.log(color("text", `❌ Failed to fetch message : ${color("error", e.message)}`)))

            if (!currentMessage) return
            if (!currentMessage.embeds[0].footer) return

            const components = currentMessage.components[0]
            const currentPage = parseInt(currentMessage.embeds[0].footer.text.split("/")[0]) - 1
            const index = command === "next" ? 1 : -1
            const nextPage = Math.max(0, Math.min(currentPage + index, 3));

            const embed = new EmbedBuilder()
                .setTitle(commandText[nextPage].title)
                .setColor("Orange")
                .setFields(commandText[nextPage].field)
                .setFooter(commandText[nextPage].footer)

            currentMessage.edit({ embeds: [embed], components: [components] })

            clearTimeout(client.timeouts.get(`help-${messageId}`))
            client.timeouts.delete(`help-${messageId}`)

            const timeout = setTimeout( async () => {
                await currentMessage.delete()
                    .catch((e) => console.log(color("text", `❌ Failed to delete message : ${color("error", e.message)}`)))
            }, 20000)

            client.timeouts.set(`help-${currentMessage.id}`, timeout)

            interaction.deferUpdate()
        } catch(e) {console.log(color("text", `❌ Failed to process interact button help : ${color("error", e.message)}`))}
    },
    cooldown: 2,
    aliases: ["h"],
    permissions: []
}

const commandText: IHelp[] = [
    {
        title: "Command List",
        field: [
            {
                name: `${process.env.PREFIX_COMMAND}channelconfig`,
                value: 
                    `
                    If you want to change ${process.env.BOT_NAME}'s channel (send the channel id).\r
                    example => **'${process.env.PREFIX_COMMAND}channelconfig 12344556677'** or **'${process.env.PREFIX_COMMAND}cfg 12344556677'**\r
                    `
            },
            {
                name: `${process.env.PREFIX_COMMAND}checkstatus`,
                value: 
                    `
                    If you want to check ${process.env.BOT_NAME}'s config.\r
                    example => **'${process.env.PREFIX_COMMAND}checkstatus'** or **'${process.env.PREFIX_COMMAND}cs'**\r
                    `
            },
            {
                name: `${process.env.PREFIX_COMMAND}detectpresence`,
                value: 
                    `
                    If you want to disable or enable detect presence.\r
                    example => **'${process.env.PREFIX_COMMAND}detectpresence false'** or **'${process.env.PREFIX_COMMAND}dp false'**\r
                    `
            },
            {
                name: `${process.env.PREFIX_COMMAND}greet`,
                value: 
                    `
                    ${process.env.BOT_NAME} will greet you!\r
                    example => **'${process.env.PREFIX_COMMAND}greet'** or **'${process.env.PREFIX_COMMAND}g'**\r
                    `
            },
            {
                name: `${process.env.PREFIX_COMMAND}notify`,
                value: 
                    `
                    If you want to disable or enable ${process.env.BOT_NAME} online notif.\r
                    example => **'${process.env.PREFIX_COMMAND}notify false'** or **'${process.env.PREFIX_COMMAND}n false'**
                    `
            }
        ],
        footer: { text: "1/4" }
    },
    {
        title: "Music Command List", 
        field: [
            {
                name: `${process.env.PREFIX_COMMAND}play`,
                value: 
                    `
                    to play and search song.\r
                    example => **'${process.env.PREFIX_COMMAND}play drown'** or **'${process.env.PREFIX_COMMAND}p drown'**\r
                    `
            },
            {
                name: `${process.env.PREFIX_COMMAND}pause`,
                value: 
                    `
                    to pause song.\r
                    example => **'${process.env.PREFIX_COMMAND}pause'** or **'${process.env.PREFIX_COMMAND}ps'**\r
                    `
            },
            {
                name: `${process.env.PREFIX_COMMAND}resume`,
                value: 
                    `
                    to resume song.\r
                    example => **'${process.env.PREFIX_COMMAND}resume'** or **'${process.env.PREFIX_COMMAND}rsm'**\r
                    `
            },
            {
                name: `${process.env.PREFIX_COMMAND}skip`,
                value: 
                    `
                    to skip song.\r
                    example => **'${process.env.PREFIX_COMMAND}skip'** or **'${process.env.PREFIX_COMMAND}s'**\r
                    `
            },
            {
                name: `${process.env.PREFIX_COMMAND}stop`,
                value: 
                    `
                    to stop player.\r
                    example => **'${process.env.PREFIX_COMMAND}stop'** or **'${process.env.PREFIX_COMMAND}stp'**\r
                    `
            },
        ],
        footer: { text: "2/4" }
    },
    {
        title: "Player Command List", 
        field: [
            {
                name: `${process.env.PREFIX_COMMAND}autoplay`,
                value: 
                    `
                    to set autoplay.\r
                    example => **'${process.env.PREFIX_COMMAND}autoplay true'** or **'${process.env.PREFIX_COMMAND}ap true'**\r
                    `
            },
            {
                name: `${process.env.PREFIX_COMMAND}loop`,
                value: 
                    `
                    to set loop (0: no loop, 1: song loop, 2: playlist loop).\r
                    example => **'${process.env.PREFIX_COMMAND}loop 0'**\r
                    `
            },
            {
                name: `${process.env.PREFIX_COMMAND}shuffle`,
                value: 
                    `
                    to set shuffle.\r
                    example => **'${process.env.PREFIX_COMMAND}shuffle true'**\r
                    `
            },
            {
                name: `${process.env.PREFIX_COMMAND}volume`,
                value: 
                    `
                    to set volume.\r
                    example => **'${process.env.PREFIX_COMMAND}volume 50'** or **'${process.env.PREFIX_COMMAND}vol 50'**\r
                    `
            }
        ],
        footer: { text: "3/4" }
    },
    {
        title: "Slash Command List", 
        field: [
            {
                name: " ",
                value:  
                    `
                    **/afk**: to announce your afk status\r
                    **/clear**: to clear messages\r
                    **/embed**: to create embed message\r
                    **/event**: to add discord schedule event\r
                    **/ping**: to test bot ping\r
                    **/poll**: to create poll\r
                    `
            }
        ],
        footer: { text: "4/4" }
    }
]

export default command