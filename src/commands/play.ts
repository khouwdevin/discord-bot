import { color, getLoopString, sendMessage, sendTimedMessage } from "../functions";
import { Command } from "../types";
import { EmbedBuilder, TextChannel, resolveColor } from "discord.js";

const command: Command = {
    name: "play",
    execute: async (message, args) => {
        try {
            const title = args.slice(1, args.length).join(" ")

            if (!title) return sendTimedMessage("Please provide a title!", message.channel as TextChannel, 5000)
            if (!message.guild || !message.guildId || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channelId) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client

            let player = client.moon.players.get(message.guildId)

            if (!player) {
                player = client.moon.players.create({
                    guildId: message.guildId,
                    voiceChannel: message.member.voice.channelId,
                    textChannel: message.channel.id,
                    autoPlay: false
                })

                const playerData = `
                    autoplay: **${player.autoPlay}**\r
                    volume: **${player.volume}**\r
                    loop: **${getLoopString(player.loop)}**\r
                    shufle: **${player.shuffled}**
                `

                const embed = new EmbedBuilder()
                    .setAuthor({ name: "Player Created", iconURL: client.user.avatarURL() || undefined })
                    .setFields({ name: " ", value: playerData })
                    .setFooter({ text: `${process.env.BOT_NAME.toUpperCase()} MUSIC` })
                    .setColor("Purple")

                message.channel.send({ embeds: [embed] })
            }

            const embedProcess = new EmbedBuilder()
                .setAuthor({ name: "Processing...", iconURL: client.user.avatarURL() || undefined })
            const processMessage = await message.channel.send({ embeds: [embedProcess] })

            const res = await client.moon.search(title)

            switch (res.loadType) {
                case "error":
                    return sendMessage(`${message.member} failed to load song!`, message.channel as TextChannel)
                case "empty":
                    return sendMessage(`${message.member} no title matches!`, message.channel as TextChannel)
                case "playlist":
                    let imageUrl = null
                    let color = resolveColor("Red")
                    if (title.includes("spotify")) {
                        const resThumbnail = await fetch(`https://open.spotify.com/oembed?url=${title}`)
                        const data = await resThumbnail.json()
                        imageUrl = data.thumbnail_url
                        color = resolveColor("Green")
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
                        .setColor("Yellow")
                    message.channel.send({ embeds: [embedSong] })

                    break
            }

            if (client.timeouts.has(`player-${player.guildId}`)) {
                clearTimeout(client.timeouts.get(`player-${player.guildId}`))
                client.timeouts.delete(`player-${player.guildId}`)
            }

            await processMessage.delete()

            if (!player.connected) {
                player.connect({
                    setDeaf: true,
                    setMute: false
                })                
            }

            if (player && (player.voiceChannel !== message.member.voice.channelId)) {
                player.setVoiceChannel(message.member.voice.channelId)
                
                player.connect({
                    setDeaf: true,
                    setMute: false
                }) 
            }

            if (!player.playing) player.play()
            
            client.attemps.set(`${player.guildId}`, 3)
        } catch(e) {console.log(color("text", `❌ Failed to play music : ${color("error", e.message)}`))}
    },
    cooldown: 1,
    permissions: [],
    aliases: ["p"]
}

export default command