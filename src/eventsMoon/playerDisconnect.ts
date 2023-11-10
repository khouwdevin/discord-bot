import { MoonlinkPlayer } from "moonlink.js";
import { MoonEvent } from "../types";
import { Client } from "discord.js";

const event: MoonEvent = {
    name: "trackStart",
    execute: async (client: Client, player: MoonlinkPlayer) => {
        if (client.attemps.has(player.guildId)) {
            client.attemps.delete(player.guildId)
        }
    }
}

export default event;