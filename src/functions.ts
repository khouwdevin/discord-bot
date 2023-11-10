import chalk from "chalk"
import { ChannelManager, ChannelType, Client, Guild, GuildMember, Message, PermissionFlagsBits, PermissionResolvable, TextChannel } from "discord.js"
import GuildDB from "./schemas/Guild"
import { GuildOption } from "./types"
import mongoose from "mongoose";

type colorType = "text" | "variable" | "error"

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c"
}

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message)
}

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    let neededPermissions: PermissionResolvable[] = []
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission)
    })
    if (neededPermissions.length === 0) return null
    return neededPermissions.map(p => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ")
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
    })
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () => 
            (await channel.messages.fetch(m))
            .delete()
            .catch((e) => console.log(color("text", `❌ Failed to delete message : ${color("error", e.message)}`)))
        , duration))
    return
}

export const sendMessage = (message: string, channel: TextChannel) => {
    channel.send(message).catch((e) => console.log(color("text", `❌ Failed to delete message : ${color("error", e.message)}`)))
}

export const sendMessageToExistingChannel = (channels: ChannelManager, message: string) => {
    for (let i = 0; i < channels.cache.size; i++){
        const channelGuild = channels.cache.at(i)

        if (!channelGuild) continue
        if (channelGuild.type !== ChannelType.GuildText) continue

        const channel = channelGuild.guild.systemChannel ? channelGuild.guild.systemChannel : channelGuild
        return channel.send(message).catch((e) => console.log(color("text", `❌ Failed to send message : ${color("error", e.message)}`)))
    }
}

export const sendTimedMessageToExistingChannel = (channels: ChannelManager, message: string, duration: number) => {
    for (let i = 0; i < channels.cache.size; i++){
        const channelGuild = channels.cache.at(i)

        if (!channelGuild) continue
        if (channelGuild.type !== ChannelType.GuildText) continue

        const channel = channelGuild.guild.systemChannel ? channelGuild.guild.systemChannel : channelGuild
        return channel.send(message).then((m) => setTimeout(() => m.delete(), duration)).catch((e) => console.log(color("text", `❌ Failed to send message : ${color("error", e.message)}`)))
    }
}

export const sendNotifyBotOnline = async (client: Client) => {
    const guilds = client.guilds.cache

    for (let i = 0; i < guilds.size; i++) {
        const guild = guilds.at(i) as Guild
        const channelId = await getGuildOption(guild, "channel")
        const notify = await getGuildOption(guild, "notify")

        if (!notify) continue

        if (channelId === "default") {
            if (!guild.systemChannel) {
                const channels = guild.channels
                sendTimedMessageToExistingChannel(channels, `Please add or update default text channel to ${process.env.BOT_NAME}'s config!`, 10000)

                continue 
            }

            const channel = guild.systemChannel as TextChannel
            sendTimedMessage(`${process.env.BOT_NAME} is back online!`, channel, 5000)

            continue
        }
        if (channelId) {
            const channel = guild.channels.cache.find(c => c.id === channelId)

            if (!channel || channel.type !== ChannelType.GuildText) {
                const channels = guild.channels
                sendTimedMessageToExistingChannel(channels, `Please add or update default text channel to ${process.env.BOT_NAME}'s config!`, 10000)

                continue
            }

            sendTimedMessage(`${process.env.BOT_NAME} is back online!`, channel, 5000)

            continue
        }

        const channels = guild.channels.cache

        for (let j = 0; j < channels.size; j++) {
            const channel = channels.at(j)
            
            if (!channel) continue
            if (channel.type !== ChannelType.GuildText) continue
            
            sendTimedMessage(`${process.env.BOT_NAME} is back online!`, channel, 5000)

            break
        }
    }
}

export const notifyToConfigDefaultTextChannel = (channels: ChannelManager) => {
    for (let i = 0; i < channels.cache.size; i++){
        const channelGuild = channels.cache.at(i)

        if (!channelGuild) continue
        if (channelGuild.type !== ChannelType.GuildText) continue
        if (!channelGuild.guild.systemChannel) return sendTimedMessageToExistingChannel(channels, `Please add or update default text channel to ${process.env.BOT_NAME}'s config!`, 10000)
            
        const channel = channelGuild.guild.systemChannel
        return channel.send(`Please add or update default text channel to ${process.env.BOT_NAME}'s config!`)
            .then((m) => setTimeout(() => m.delete(), 10000))
            .catch(() => console.log(color("text", `❌ Failed to ${color("error", "notify config default message")}`)))
    }
}

export const deleteTimedMessage = (message: Message, channel: TextChannel, duration: number) => {
    setTimeout(
        async () => (await channel.messages.fetch(message))
            .delete()
            .catch((e) => console.log(color("text", `❌ Failed to delete message : ${color("error", e.message)}`)))
    , duration)
}

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
    if (mongoose.connection.readyState === 0) return console.log(color("text", `❌ Database ${color("error", "not connected")}`))
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    return foundGuild.options[option]
}

export const getAllGuildOption = async (guild: Guild) => {
    if (mongoose.connection.readyState === 0) return console.log(color("text", `❌ Database ${color("error", "not connected")}`))
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    return foundGuild.options
}

export const setGuildOption = async (guild: Guild, option: GuildOption, value: any) => {
    if (mongoose.connection.readyState === 0) return console.log(color("text", `❌ Database ${color("error", "not connected")}`))
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    foundGuild.options[option] = value
    foundGuild.save()
}

export const getAllGuild = async () => {
    if (mongoose.connection.readyState === 0) return console.log(color("text", `❌ Database ${color("error", "not connected")}`))
    const guilds = await GuildDB.find()
    return guilds
}

export const getDateChoices = (): Array<string> => {
    const result: Array<string> = []

    for (let i = 0; i < 8; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)

        const thedate = date.toDateString().split(" ")
        const formateddate = `${thedate[2]} ${thedate[1]} ${thedate[3]}`

        result.push(formateddate)
    }

    return result
}

export const getTimeChoices = (): Array<string> => {
    const result: Array<string> = []

    for (let i = 1; i < 13; i++) {
        if (i < 10) {
            result.push(`0${i}:00`)
        }
        else {
            result.push(`${i}:00`)
        }
    }

    return result
}