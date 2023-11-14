import { MoonlinkNode } from "moonlink.js";
import { MoonEvent } from "../types";
import { color } from "../functions";

const event: MoonEvent = {
    name: "nodeClose",
    execute: async (node: MoonlinkNode, code: number, reason: any) => {
        console.log(
            color("text", `❌ Disconnected from ${color("variable", node.host)} code ${color("variable", code)} reason ${color("variable", reason)}`)
        )
    }
}

export default event;

