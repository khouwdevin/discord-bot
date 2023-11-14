import { MoonlinkNode } from "moonlink.js";
import { MoonEvent } from "../types";
import { color } from "../functions";

const event: MoonEvent = {
    name: "nodeReconnect",
    execute: (node: MoonlinkNode) => {
        console.log(
            color("text", `🔃 Reconnecting to ${color("variable", node.host)}`)
        ) 
    }
}

export default event;