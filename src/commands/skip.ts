import { sendMessage, sendTimedMessage } from "../functions";
import { Command } from "../types";
import { EmbedBuilder, TextChannel } from "discord.js";

const command: Command = {
    name: "skip",
    execute: async (message, args) => {
        try {
            const lavalink = process.env.LAVALINK_HOST
            if (!lavalink) return

            const botname = process.env.BOT_NAME

            if (!message.guildId || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channel || !message.member.voice.channelId) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client
            const player = client.moon.players.get(message.guildId)

            if (!player) return sendTimedMessage(`${message.member} ${botname} music is not active!`, message.channel as TextChannel, 5000)
            if (message.member.voice.channel.id !== player.voiceChannel) return sendTimedMessage(`${message.member} isn't joining in a same voice channel!`, message.channel as TextChannel, 5000)
            if (player.queue.size <= 0) return sendMessage(`${message.member} this is the last song, no other song in queue!`, message.channel as TextChannel)

            sendMessage(`${message.member} song skipped!`, message.channel as TextChannel)
            player.skip()
        } catch {}
    },
    cooldown: 1,
    permissions: [],
    aliases: ["s"]
}

export default command