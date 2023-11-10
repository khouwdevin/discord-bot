import { ShardingManager } from "discord.js";
import { color } from "./functions";
import commandLineArgs from "command-line-args";
import dotenv from "dotenv";
import path from "path";

const options = commandLineArgs([
    {
      name: 'env',
      alias: 'e',
      defaultValue: 'development',
      type: String,
    },
])

try {
  if (options.env === "production") {
    dotenv.config()
  }
  else {
    dotenv.config({
      path: path.join(__dirname, `../development.env`),
    })
  }
}
catch(e) {
  throw e
}

const shardingManager = new ShardingManager("./build/pre-start.js", {
    token: process.env.TOKEN,
    totalShards: "auto"
})

shardingManager.on("shardCreate", (shard) => {
    console.log(
        color("text", `🤖 Launched sharding manager ${color("variable", shard.id)} shard`)
    )
})

shardingManager.spawn()