import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";

const command : Command = {
    name: "greet",
    execute: (message, args) => {
        try {
            let toGreet = message.mentions.members?.first()
            message.channel.send(`Hello there ${toGreet ? toGreet.user.username : message.member?.user.username}!`)
        } catch {}
    },
    aliases: ["g"],
    permissions: [] // to test
}

export default command