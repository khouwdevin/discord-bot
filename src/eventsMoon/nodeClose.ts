import { MoonlinkNode } from "moonlink.js";
import { MoonEvent } from "../types";
import { color } from "../functions";

const event: MoonEvent = {
    name: "nodeClose",
    execute: async (node: MoonlinkNode) => {
        console.log(
            color("text", `❌ Disconnected from ${color("variable", node.host)}`)
        )

        setTimeout( async () => {
            await node.connect()
            console.log(
                color("text", `🔃 Try to reconnect with ${color("variable", node.host)}`)
            )
        }, 10000)         
    }
}

export default event;

