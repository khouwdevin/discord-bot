import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import PollModel from "../schemas/Poll";
import { color } from "../functions";

const emojies = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]
const minutesTimeout = 2

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("poll")
    
    .addStringOption(option => { 
        return option
        .setName("title")
        .setDescription("Add title")
        .setRequired(true)
        .setMaxLength(50)
    })
    .addStringOption(option => {
        return option
        .setName("option1")
        .setDescription("Add option 1 of 5")
        .setRequired(true)
        .setMaxLength(150)
    })
    .addStringOption(option => {
        return option
        .setName("option2")
        .setDescription("Add option 2 of 5")
        .setRequired(true)
        .setMaxLength(150)
    })
    .addStringOption(option => {
        return option
        .setName("option3")
        .setDescription("Add option 3 of 5")
        .setMaxLength(150)
    })
    .addStringOption(option => {
        return option
        .setName("option4")
        .setDescription("Add option 4 of 5")
        .setMaxLength(150)
    })
    .addStringOption(option => {
        return option
        .setName("option5")
        .setDescription("Add option 5 of 5")
        .setMaxLength(150)
    })
    .setDescription("To create polling"),
    execute: async (interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true })

            if (!interaction.channel) return

            const buttons: ButtonBuilder[] = []

            const guildid = interaction.guildId
            const channel = interaction.channel
            const options = interaction.options.data

            const date = new Date()
            const minutes = date.getMinutes() + minutesTimeout
            const minutesNumber = minutes > 60 ? minutes - 60 : minutes
            const currentMinutes = minutesNumber >= 10 ? minutesNumber : `0${minutesNumber}`

            const newPoll = new PollModel({
                guildID: guildid
            })

            for (let i = 1; i < options.length; i++) {
                newPoll.pollResult[i - 1] = 0

                buttons.push(
                    new ButtonBuilder()
                        .setEmoji(emojies[i - 1])
                        .setLabel(`${options[i].value}`)
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`poll.${newPoll._id}.${i}`)
                )
            }

            const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.displayName}` || 'Default Name', iconURL: interaction.user?.avatarURL() || undefined })
                .setTitle(`Poll's Subject: ${options[0].value?.toString().toUpperCase()}`)        
                .setFooter(
                    { text: `poll is still ongoing until minutes ${currentMinutes}!`, iconURL: undefined }
                )
                .setColor("Blue")

            for (let i = 1; i < options.length; i++) {
                embed.addFields(
                    { name: `${options[i].value}`, value: `${emojies[i - 1]} 0 votes (0.0%)` }
                )
            }

            const message = await channel.send({ embeds: [embed], components: [buttonsRow] })

            newPoll.messageID = message.id

            const timeout = setTimeout( async () => {
                await PollModel.deleteOne({ _id: newPoll._id })
                interaction.client.timeouts.delete(`poll-${newPoll._id}`)

                if (!interaction.channel) return console.log(color("text", `❌ Failed to execute poll slash command : ${color("error", "channel unavailable")}`))

                try {
                    const timeoutMessage = await interaction.channel.messages
                        .fetch(newPoll.messageID)
                        .catch((e) => console.log(color("text", `❌ Failed to fetch message : ${color("error", e.message)}`)))
            
                    if (!timeoutMessage) return
    
                    const embedTimeout = timeoutMessage.embeds[0]
                    const winnerResult = "**NONE IS A WINNER!**"

                    const embed = new EmbedBuilder()
                        .setAuthor(embedTimeout.author)
                        .setTitle(embedTimeout.title)
                        .setFields(embedTimeout.fields)        
                        .setFooter(
                            { text: "poll is over!", iconURL: undefined }
                        )
                        .setColor("Blue")

                    embed.addFields(
                        { name: " ", value: winnerResult }
                    )
    
                    await timeoutMessage.edit({
                        embeds: [embed],
                        components: []
                    })
                } catch {}
            }, minutesTimeout * 60 * 1000)

            interaction.client.timeouts.set(`poll-${newPoll._id}`, timeout)

            await newPoll.save()

            await interaction.editReply("Poll sent successfully!")
        } catch(e) {console.log(color("text", `❌ Failed to execute poll : ${color("error", e.message)}`))}
    },
    button: async (interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true })

            const [type, pollID, optionString] = interaction.customId.split(".")
            const targetPoll = await PollModel.findOne({ _id: pollID })

            if (!interaction.channel) return await interaction.editReply("Channel has been deleted!")
            if (!targetPoll) return await interaction.editReply("Poll is over!")

            clearTimeout(interaction.client.timeouts.get(`poll-${pollID}`))
            interaction.client.timeouts.delete(`poll-${pollID}`)

            const targetMessage = await interaction.channel.messages
                .fetch(targetPoll.messageID)
                .catch((e) => console.log(color("text", `❌ Failed to fetch message : ${color("error", e.message)}`)))

            if (!targetMessage) return

            const targetMessageEmbed = targetMessage.embeds[0]

            const option = parseInt(optionString)
            const userID = `${interaction.user.id}.option${option}`

            const date = new Date()
            const minutes = date.getMinutes() + minutesTimeout
            const minutesNumber = minutes > 60 ? minutes - 60 : minutes
            const currentMinutes = minutesNumber >= 10 ? minutesNumber : `0${minutesNumber}`

            for (let i = 0; i < targetPoll.pollResult.length; i++) {
                if (i === (option - 1)) {
                    if (targetPoll.usersID.includes(userID)) {
                        targetPoll.pollResult[option - 1] = targetPoll.pollResult[option - 1] - 1

                        const index = targetPoll.usersID.indexOf(userID)
                        targetPoll.usersID.splice(index, 1)

                        for (let i = 0; i < targetPoll.pollResult.length; i++) {
                            const userLength = targetPoll.usersID.length < 1 ? 1 : targetPoll.usersID.length
                            const percentage = (targetPoll.pollResult[i] / userLength) * 100

                            targetMessageEmbed.fields[i].value = `${emojies[i]} ${targetPoll.pollResult[i]} votes (${percentage}%)`
                        }

                        const embed = new EmbedBuilder()
                            .setAuthor(targetMessageEmbed.author)
                            .setTitle(targetMessageEmbed.title)
                            .setFields(targetMessageEmbed.fields)        
                            .setFooter(
                                { text: `poll is still ongoing until minutes ${currentMinutes}!`, iconURL: undefined }
                            )
                            .setColor("Blue")

                        await targetMessage.edit({
                            embeds: [embed],
                            components: [targetMessage.components[0]]
                        })

                        await targetPoll.save()

                        const timeout = setTimeout( async () => {
                            const poll = await PollModel.findOne({ _id: pollID })
                
                            await PollModel.deleteOne({ _id: pollID })
                            interaction.client.timeouts.delete(`poll-${pollID}`)
                
                            if (!interaction.channel || !poll) return
                
                            try {
                                const timeoutMessage = await interaction.channel.messages
                                    .fetch(targetPoll.messageID)
                                    .catch((e) => console.log(color("text", `❌ Failed to delete message : ${color("error", e.message)}`)))
            
                                if (!timeoutMessage) return
                
                                const embedTimeout = timeoutMessage.embeds[0]
                
                                const result = poll.pollResult
                                const winner = result.every((val) => val === result[0]) ? -1 : Math.max(...result)
                                const winnerResult = winner === -1 ? "**THE RESULT IS TIE!**" : `**[${emojies[winner]}] ${embedTimeout.fields[winner].name} IS THE WINNER!**`

                                const embed = new EmbedBuilder()
                                    .setAuthor(embedTimeout.author)
                                    .setTitle(embedTimeout.title)
                                    .setFields(embedTimeout.fields)        
                                    .setFooter(
                                        { text: "poll is over!", iconURL: undefined }
                                    )
                                    .setColor("Blue")

                                embed.addFields(
                                    { name: " ", value: winnerResult }
                                )
                
                                await timeoutMessage.edit({
                                    embeds: [embed],
                                    components: []
                                })
                            } catch {}
                        }, minutesTimeout * 60 * 1000)

                        interaction.client.timeouts.set(`poll-${targetPoll._id}`, timeout)

                        return await interaction.editReply("Your vote has been removed!")
                    }

                    targetPoll.pollResult[option - 1] = targetPoll.pollResult[option - 1] + 1

                    targetPoll.usersID = [...targetPoll.usersID, userID]

                    for (let i = 0; i < targetPoll.pollResult.length; i++) {
                        const percentage = (targetPoll.pollResult[i] / targetPoll.usersID.length) * 100

                        targetMessageEmbed.fields[i].value = `${emojies[i]} ${targetPoll.pollResult[i]} votes (${percentage}%)`
                    }

                    const embed = new EmbedBuilder()
                        .setAuthor(targetMessageEmbed.author)
                        .setTitle(targetMessageEmbed.title)
                        .setFields(targetMessageEmbed.fields)        
                        .setFooter(
                            { text: `poll is still ongoing until minutes ${currentMinutes}!`, iconURL: undefined }
                        )
                        .setColor("Blue")

                    await targetMessage.edit({
                        embeds: [embed],
                        components: [targetMessage.components[0]]
                    })

                    await targetPoll.save()

                    const timeout = setTimeout( async () => {
                        const poll = await PollModel.findOne({ _id: pollID })
            
                        await PollModel.deleteOne({ _id: pollID })
                        interaction.client.timeouts.delete(`poll-${pollID}`)
            
                        if (!interaction.channel || !poll) return
            
                        try {
                            const timeoutMessage = await interaction.channel.messages
                                .fetch(targetPoll.messageID)
                                .catch((e) => console.log(color("text", `❌ Failed to delete message : ${color("error", e.message)}`)))
            
                            if (!timeoutMessage) return
            
                            const embedTimeout = timeoutMessage.embeds[0]
            
                            const result = poll.pollResult
                            const winner = result.every((val) => val === result[0]) ? -1 : Math.max(...result)
                            const winnerResult = winner === -1 ? "**THE RESULT IS TIE!**" : `**[${emojies[winner]}] ${embedTimeout.fields[winner].name} IS THE WINNER!**`

                            const embed = new EmbedBuilder()
                                .setAuthor(embedTimeout.author)
                                .setTitle(embedTimeout.title)
                                .setFields(embedTimeout.fields)        
                                .setFooter(
                                    { text: "poll is over!", iconURL: undefined }
                                )
                                .setColor("Blue")

                            embed.addFields(
                                { name: " ", value: winnerResult }
                            )
            
                            await timeoutMessage.edit({
                                embeds: [embed],
                                components: []
                            })
                        } catch {}
                    }, minutesTimeout * 60 * 1000)

                    interaction.client.timeouts.set(`poll-${targetPoll._id}`, timeout)

                    return await interaction.editReply("Your vote has been sent!")
                }
            }

            await interaction.editReply("Some error occured!")
        } catch(e) {console.log(color("text", `❌ Failed to vote in poll slash command : ${color("error", e.message)}`))}
    },
    cooldown: 2
}

export default command;