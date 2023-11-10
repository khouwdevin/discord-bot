import { sendMessage, sendTimedMessage } from "../functions";
import { Command } from "../types";
import { Colors, EmbedBuilder, TextChannel, resolveColor } from "discord.js";

const command: Command = {
    name: "play",
    execute: async (message, args) => {
        try {
            const lavalink = process.env.LAVALINK_HOST
            if (!lavalink) return
            
            const title = args.slice(1, args.length).join(" ")

            if (!title) return sendTimedMessage("Please provide a title!", message.channel as TextChannel, 5000)
            if (!message.guild || !message.guild.id || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channel || !message.member.voice.channelId) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client
            const playerStatus = client.moon.players.get(message.guild.id)

            const player = playerStatus !== null ? playerStatus :
                client.moon.players.create({
                    guildId: message.guild.id,
                    voiceChannel: message.member.voice.channel.id,
                    textChannel: message.channel.id
                })

            if (!player.connected) {
                player.connect({
                    setDeaf: true,
                    setMute: false
                })
            }

            if (playerStatus && client.timeouts.has(`player-${player.guildId}`)) {
                clearTimeout(client.timeouts.get(`player-${player.guildId}`))
                client.timeouts.delete(`player-${player.guildId}`)
            }

            const processMessage = await message.channel.send("Processing...")

            const res = await client.moon.search(title)

            switch (res.loadType) {
                case "error":
                    return sendMessage(`${message.member} failed to load song!`, message.channel as TextChannel)
                case "empty":
                    return sendMessage(`${message.member} no title matches!`, message.channel as TextChannel)
                case "playlist":
                    let imageUrl = null
                    let color = resolveColor(Colors.Red)
                    if (title.includes("spotify")) {
                        const resThumbnail = await fetch(`https://open.spotify.com/oembed?url=${title}`)
                        const data = await resThumbnail.json()
                        imageUrl = data.thumbnail_url
                        color = resolveColor(Colors.Green)
                    }
                    const embedPlaylist  = new EmbedBuilder()
                        .setFields(
                            { name: `Added Playlist`, value: " " },
                            { name: "Playlist", value: `${res.playlistInfo?.name || "No title"}` },
                            { name: "Playlist duration", value: `${res.playlistInfo?.duration || "-"}` }
                        )
                        .setColor(color)
                        .setImage(imageUrl)
                    message.channel.send({ embeds: [embedPlaylist] })

                    for (const track of res.tracks) {
                        player.queue.add(track)
                    }

                    break
                default:
                    player.queue.add(res.tracks[0])

                    const embedSong  = new EmbedBuilder()
                        .setAuthor({ name: `[${res.tracks[0].title}] was added to the waiting list!`, iconURL: message.client.user.avatarURL() || undefined })
                    message.channel.send({ embeds: [embedSong] })

                    break
            }

            processMessage.delete()

            if (!player.playing) player.play()
            
            client.attemps.set(`${player.guildId}`, 3)
        } catch {}
    },
    cooldown: 1,
    permissions: [],
    aliases: ["p"]
}

export default command