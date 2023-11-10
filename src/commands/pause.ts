import { sendTimedMessage } from "../functions";
import { Command } from "../types";
import { TextChannel } from "discord.js";

const command: Command = {
    name: "pause",
    execute: async (message, args) => {
        try {
            const lavalink = process.env.LAVALINK_HOST
            if (!lavalink) return

            const botname = process.env.BOT_NAME

            if (!message.guildId || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channelId) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client
            const player = client.moon.players.get(message.guildId)

            if (!player) return sendTimedMessage(`${message.member} ${botname} music is not active!`, message.channel as TextChannel, 5000)

            if (!player.paused) {
                sendTimedMessage(`${message.member} music is paused!`, message.channel as TextChannel, 5000)
                player.pause()
            }
        } catch {}
    },
    cooldown: 1,
    permissions: [],
    aliases: ["ps"]
}

export default command