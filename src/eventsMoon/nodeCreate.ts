import { MoonlinkNode } from "moonlink.js";
import { MoonEvent } from "../types";
import { color } from "../functions";

const event: MoonEvent = {
    name: "nodeCreate",
    execute: (node: MoonlinkNode) => {
        console.log(
            color("text", `💪 Connected to ${color("variable", node.host)}`)
        )
    }
}

export default event;