import { Client } from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";

const event : BotEvent = {
    name: "raw",
    once: true,
    execute: async (client: Client, data: any) => {
        const lavalink = process.env.LAVALINK_HOST
        if (!lavalink) return
        
        client.moon.packetUpdate(data)
    }
}

export default event;