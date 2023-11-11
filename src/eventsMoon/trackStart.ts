import { MoonlinkPlayer } from "moonlink.js";
import { MoonEvent } from "../types";
import { EmbedBuilder } from "@discordjs/builders";
import { ChannelType, Client } from "discord.js";

const event: MoonEvent = {
    name: "trackStart",
    execute: async (client: Client, player: MoonlinkPlayer, track: any) => {
        const channel = await client.channels.fetch(player.textChannel).catch(() => {return null})

        if (!channel || channel.type !== ChannelType.GuildText) return

        const embed  = new EmbedBuilder()
            .setAuthor({ name: `Now playing [${track.title}]`, iconURL: client.user?.avatarURL() || undefined })

        channel.send({ embeds: [embed] })
    }
}

export default event;