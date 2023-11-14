import { MoonlinkPlayer } from "moonlink.js";
import { MoonEvent } from "../types";
import { Client } from "discord.js";

const event: MoonEvent = {
    name: "queueEnd",
    execute: async (client: Client, player: MoonlinkPlayer, track: any) => {
        
        const timeout = setTimeout( async () => {
            await player.stop(true)
            client.timeouts.delete(`player-${player.guildId}`)
        }, 20000)

        client.timeouts.set(`player-${player.guildId}`, timeout)
    }
}

export default event;