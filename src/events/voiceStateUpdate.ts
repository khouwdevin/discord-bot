import { TextChannel, VoiceState } from "discord.js";
import { BotEvent } from "../types";
import { getGuildOption, notifyToConfigDefaultTextChannel, sendMessage, sendTimedMessageToExistingChannel } from "../functions";

const event: BotEvent = {
    name: "voiceStateUpdate",
    execute: async (oldstate: VoiceState, newstate: VoiceState) => {
        if (newstate.channelId === null) {
            const detectvoice = await getGuildOption(oldstate.guild, "detectvoice")

            if (detectvoice) {
                const channelGuildId = await getGuildOption(oldstate.guild, "channel")

                if (oldstate.client.user !== oldstate.member?.user){
                    if (!oldstate.guild?.channels.cache.find((c) => c.id === channelGuildId)) {
                        sendTimedMessageToExistingChannel(oldstate.guild.channels, "Channel has been deleted or doesn't exist, please provide a new one in channelconfig!", 10000)
                    }
                    else {
                        const channel = channelGuildId === "default" ? oldstate.guild.systemChannel : await oldstate.guild.channels.fetch(channelGuildId as string)
    
                        if (!channel) notifyToConfigDefaultTextChannel(newstate.guild.channels)
                        else sendMessage(`${oldstate.member?.user} left ${oldstate.channel} channel!`, channel as TextChannel)
                    }
                }                
            }

            const lavalink = process.env.LAVALINK_HOST
            if (!lavalink) return
            if (!oldstate.channel) return

            const members = oldstate.channel.members
            const channel = oldstate.channel
            const client = oldstate.client
            const player = client.moon.players.get(oldstate.guild.id)

            if (members.size < 2 && player && (player.voiceChannel === channel.id)) {
                const timeout = setTimeout(() => {
                    player.disconnect()
                    client.timeouts.delete(`player-${player.guildId}`)
                }, 20000)

                client.timeouts.set(`player-${oldstate.guild.id}`, timeout)
            }
        }
        else if (oldstate.channelId === null){
            const detectvoice = await getGuildOption(newstate.guild, "detectvoice")

            if (detectvoice) {
                const channelGuildId = await getGuildOption(newstate.guild, "channel")

                if (newstate.client.user !== newstate.member?.user){
                    if (!newstate.guild?.channels.cache.find((c) => c.id === channelGuildId)) {
                        sendTimedMessageToExistingChannel(newstate.guild.channels, "Channel has been deleted or doesn't exist, please provide a new one in channelconfig!", 10000)
                    }
        
                    else {
                        const channel = channelGuildId === "default" ? newstate.guild.systemChannel : await newstate.guild.channels.fetch(channelGuildId as string)
        
                        if (!channel) notifyToConfigDefaultTextChannel(newstate.guild.channels)
                        else sendMessage(`${newstate.member?.user} joined ${newstate.channel} channel!`, channel as TextChannel)
                    }
                }
            }      

            if (!newstate.channel) return

            const channel = newstate.channel
            const client = newstate.client
            const player = client.moon.players.get(newstate.guild.id)

            if (player && client.timeouts.has(`player-${newstate.guild.id}`) && (player.voiceChannel === channel.id)) {
                clearTimeout(client.timeouts.get(`player-${newstate.guild.id}`))
                client.timeouts.delete(newstate.guild.id)
            }
        }
    }
}

export default event