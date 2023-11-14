import { color, sendMessage, sendTimedMessage } from "../functions";
import { Command } from "../types";
import { EmbedBuilder, TextChannel } from "discord.js";

const command: Command = {
    name: "skip",
    execute: async (message, args) => {
        try {
            if (!message.guildId || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channelId) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client
            const player = client.moon.players.get(message.guildId)
            const channel = message.channel

            if (!player) return sendTimedMessage(`${message.member} ${process.env.BOT_NAME} music is not active!`, channel as TextChannel, 5000)
            if (message.member.voice.channelId !== player.voiceChannel) return sendTimedMessage(`${message.member} isn't joining in a same voice channel!`, channel as TextChannel, 5000)
            if (player.queue.size <= 0) return sendMessage(`${message.member} this is the last song, no other song in queue!`, channel as TextChannel)

            const embed = new EmbedBuilder()
                .setAuthor({ name:  "Song is skipped!", iconURL: client.user.avatarURL() || undefined })
                .setColor("Yellow")
            channel.send({ embeds: [embed] })

            await player.skip()
        } catch(e) {console.log(color("text", `❌ Failed to skip music : ${color("error", e.message)}`))}
    },
    cooldown: 1,
    permissions: [],
    aliases: ["s"]
}

export default command