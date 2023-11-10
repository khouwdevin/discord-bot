import { Client, GatewayIntentBits, Collection } from "discord.js";
import { Command, SlashCommand } from "./types";
import { readdirSync } from "fs";
import { join } from "path";
import { MoonlinkManager } from "moonlink.js";

const { Guilds, MessageContent, GuildMessages, GuildMessageReactions, GuildMessageTyping, GuildMembers, GuildVoiceStates, GuildScheduledEvents } = GatewayIntentBits
const client = new Client({intents:[Guilds, MessageContent, GuildMessages, GuildMessageReactions, GuildMessageTyping, GuildMembers, GuildVoiceStates, GuildScheduledEvents ]})

client.slashCommands = new Collection<string, SlashCommand>()
client.commands = new Collection<string, Command>()
client.cooldowns = new Collection<string, number>()
client.timeouts = new Collection<string, NodeJS.Timeout>()
client.attemps = new Collection<string, number>()

client.moon = new MoonlinkManager(
	[{
		host: `${process.env.LAVALINK_HOST}`,
		port: parseInt(process.env.LAVALINK_PORT),
		secure: true,
		password: `${process.env.LAVALINK_PASSWORD}`,
		identifier: `${process.env.LAVALINK_IDENTIFIER}`
	}],
	{ 
		clientName: process.env.BOT_NAME,
		reconnectAtattemps: 5,
		retryTime: 3000,
		retryAmount: 3,
		spotify: {
			clientId: process.env.SPOTIFY_CLIENTID,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET
		},
		sortNode: "memory"
  	},
	(guildId: string, sPayload: string) => {
		if (!guildId || !client.guilds || !client.guilds.cache) return

		const guild = client.guilds.cache.get(guildId)
    	if (guild) guild.shard.send(JSON.parse(sPayload))
	}
)

const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    if (!handler.endsWith(".js")) return;
    require(`${handlersDir}/${handler}`)(client)
})

client.login(process.env.TOKEN)