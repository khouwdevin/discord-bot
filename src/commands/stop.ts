import { sendMessage, sendTimedMessage } from "../functions";
import { Command } from "../types";
import { TextChannel } from "discord.js";

const command: Command = {
    name: "stop",
    execute: async (message, args) => {
        try {
            const lavalink = process.env.LAVALINK_HOST
            if (!lavalink) return

            const botname = process.env.BOT_NAME
            
            if (!message.guildId || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channel || !message.member.voice.channel.id) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client
            const player = client.moon.players.get(message.guildId)

            if (!player) return sendTimedMessage(`${message.member} ${botname} music is not active!`, message.channel as TextChannel, 5000)
            if (message.member.voice.channel.id !== player.voiceChannel) return sendTimedMessage(`${message.member} isn't joining in a same voice channel!`, message.channel as TextChannel, 5000)

            sendMessage(`${message.member} player stopped!`, message.channel as TextChannel)
            await player.stop()
        } catch {}
    },
    cooldown: 1,
    permissions: [],
    aliases: ["stp"]
}

export default command