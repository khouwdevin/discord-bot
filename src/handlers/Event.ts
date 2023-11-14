import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../functions";
import { BotEvent, MoonEvent } from "../types";
import { MoonlinkNode } from "moonlink.js";

module.exports = (client: Client) => {
    let eventsDir = join(__dirname, "../events")
    let eventsMoonDir = join(__dirname, "../eventsMoon")

    readdirSync(eventsDir).forEach(file => {
        if (!file.endsWith(".js")) return;
        let event: BotEvent = require(`${eventsDir}/${file}`).default

        if (event.name === "raw") {
            client.on(event.name, (...args) => event.execute(client, ...args))
            return console.log(color("text", `🌠 Successfully loaded event ${color("variable", event.name)}`))
        }
        
        event.once ?
        client.once(event.name, (...args) => event.execute(...args))
        :
        client.on(event.name, (...args) => event.execute(...args))
        console.log(color("text", `🌠 Successfully loaded event ${color("variable", event.name)}`))
    })

    readdirSync(eventsMoonDir).forEach(file => {
        if (!file.endsWith(".js")) return;
        let event: MoonEvent = require(`${eventsMoonDir}/${file}`).default

        if (event.name === "nodeCreate" || event.name === "nodeReconnect") client.moon.on(event.name, (node: MoonlinkNode) => event.execute(node))
        else if (event.name === "nodeClose") client.moon.on("nodeClose", (node, code, reason) => event.execute(node, code, reason))
        else if (event.name === "trackStart" || event.name === "trackStuck" || event.name === "trackError") client.moon.on(event.name, (player, track) => event.execute(client, player, track))
        else if (event.name === "queueEnd") client.moon.on(event.name, (player, track) => event.execute(client, player, track))
        else if (event.name === "playerDisconnect") client.moon.on("playerDisconnect", (player) => event.execute(client, player))
        
        console.log(color("text", `🌠 Successfully loaded moon event ${color("variable", event.name)}`))
    })

    process.on('unhandledRejection', (error) => {
        console.log(color("text", `❌ Unhandled promise rejection: ${color("error", error)}`))
    })
}
