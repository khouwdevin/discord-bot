import { MoonlinkPlayer } from "moonlink.js";
import { MoonEvent } from "../types";
import { Client } from "discord.js";

const event: MoonEvent = {
    name: "playerDisconnect",
    execute: async (client: Client, player: MoonlinkPlayer) => {
        if (client.attemps.has(player.guildId)) {
            client.attemps.delete(player.guildId)
        }

        await player.destroy()
    }
}

export default event;