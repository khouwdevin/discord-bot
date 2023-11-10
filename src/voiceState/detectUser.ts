import { VoiceState } from "discord.js";

const DetectUser = (voiceState: VoiceState, option: number) => {
    try {
        if (!voiceState.channel) return

        const members = voiceState.channel.members
        const channel = voiceState.channel
        const client = voiceState.client
        const player = client.moon.players.get(voiceState.guild.id)

        if (!player) return
        if (player.voiceChannel !== channel.id) return
        
        if (option === 0) {
            if (members.size > 2) return

            const timeout = setTimeout(() => {
                player.disconnect()
                client.timeouts.delete(`player-${player.guildId}`)
            }, 20000)

            client.timeouts.set(`player-${voiceState.guild.id}`, timeout)
        }
        else {
            if (!client.timeouts.has(`player-${voiceState.guild.id}`)) return

            clearTimeout(client.timeouts.get(`player-${voiceState.guild.id}`))
            client.timeouts.delete(voiceState.guild.id)
        }
    } catch {}
}

export default DetectUser