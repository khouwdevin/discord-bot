import { color, getLoopString, getPlayerData, sendTimedMessage } from "../functions";
import { Command } from "../types";
import { EmbedBuilder, TextChannel } from "discord.js";

const command: Command = {
    name: "shuffle",
    execute: async (message, args) => {
        try {
            const shuffle = args[1]

            if (!shuffle || (shuffle !== "true" && shuffle !== "false")) return sendTimedMessage("Shuffle configuration is not valid!", message.channel as TextChannel, 5000)
            if (!message.guildId || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channelId) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client
            const channel = message.channel
            const player = client.moon.players.get(message.guildId)

            if (!player) return sendTimedMessage(`${message.member} ${process.env.BOT_NAME} music is not active!`, channel as TextChannel, 5000)
            if (player.queue.size < 1) return sendTimedMessage(`${message.member} there's no track in queue, can't do shuffle!`, channel as TextChannel, 5000)
            if (message.member.voice.channelId !== player.voiceChannel) return sendTimedMessage(`${message.member} isn't joining in a same voice channel!`, channel as TextChannel, 5000)

            player.shuffle(shuffle === "true" ? true : false)

            const playerData = getPlayerData(player)

            const embed = new EmbedBuilder()
                .setAuthor({ name: "Player Updated", iconURL: client.user.avatarURL() || undefined })
                .setFields({ name: " ", value: playerData })
                .setFooter({ text: `${process.env.BOT_NAME.toUpperCase()} MUSIC` })
                .setColor("Purple")
            channel.send({ embeds: [embed] })
        } catch(e) {console.log(color("text", `❌ Failed to configure shuffle : ${color("error", e.message)}`))}
    },
    cooldown: 1,
    permissions: [],
    aliases: []
}

export default command