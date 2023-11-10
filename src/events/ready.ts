import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../types";
import { color, sendNotifyBotOnline } from "../functions";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: async (client: Client) => {  
        sendNotifyBotOnline(client)

        if (!client.user) return

        client.user.setPresence({
            status: 'online',
            activities: [{
                name: `${process.env.PREFIX_COMMAND}help`,
                type: ActivityType.Listening
            }]
        })

        console.log(
            color("text", `💪 Logged in as ${color("variable", client.user.tag)}`)
        )

        const lavalink = process.env.LAVALINK_HOST
        if (!lavalink) return console.log(color("text", `❌ Lavalink is ${color("error", "not connected")}`))

        client.moon.init(client.user.id)
    }
}

export default event;