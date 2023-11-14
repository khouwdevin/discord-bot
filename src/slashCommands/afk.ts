import { SlashCommandBuilder, GuildMember, PermissionFlagsBits } from "discord.js"
import { SlashCommand } from "../types";
import { color } from "../functions";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("afk")
        .addBooleanOption(options => {
            return options
                .setName("afk")
                .setDescription("Are you afk 'true' or 'false'")
                .setRequired(true)
        })
        .addIntegerOption(options => {
            return options
                .setName("time")
                .setDescription("For how many long? (minutes)")
                .setMinValue(1)
                .setRequired(false)
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ChangeNickname)
        .setDescription("Tell your friend if you are going to AFK.")
    ,
    execute: async (interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true })

            if (!interaction.channel) return console.log(color("text", `❌ Failed to execute AFK slash command : ${color("error", "channel unavailable")}`))

            const options = interaction.options.data
            const minutes: number = options[1].value as number ? options[1].value as number : 0

            const userminutesafk = minutes === 0 ? "" : `for ${minutes} minutes`

            const member = (interaction.member as GuildMember)
            const isAFK = options[0].value as boolean

            if (isAFK){
                member.setNickname(`[AFK]${member.user.displayName}`).catch(() => {})
                await interaction.channel?.send(`${member} is AFK for ${userminutesafk}`)
            }
            else{
                member.setNickname(member.user.displayName.replace("[AFK]", "")).catch((e) => {})
                await interaction.channel?.send(`${member} is not AFK`)
            }

            await interaction.editReply("Your command is successfully ran!")
        } catch(e) {console.log(color("text", `❌ Failed to execute AFK slash command : ${color("error", e.message)}`))}
    }
}

export default command