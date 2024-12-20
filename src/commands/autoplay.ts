import { ApplicationCommandDataResolvable, ChatInputCommandInteraction } from "discord.js";
import { Bot, Command } from "../structures/client";

export default class implements Command {
    data: Partial<ApplicationCommandDataResolvable> = {
        name: "autoplay",
        description: "Toggle autoplay",
    }

    constructor(private client: Bot) { }

    async run(interaction: ChatInputCommandInteraction<"cached">) {
        if (!interaction.member.voice.channelId) {
            interaction.reply({
                content: "You need to be in a voice channel to toggle autoplay",
                ephemeral: true
            });

            return;
        }

        const player = this.client.manager.players.get(interaction.guildId);


        if (!player) {
            interaction.reply({
                content: "No have player in this channel",
                ephemeral: true
            });

            return;
        }

        if (!player.playing || player.paused) {
            interaction.reply({
                content: "The player is not playing",
                ephemeral: true
            });

            return
        }

        const enable = player.isAutoplay;

        player.setAutoplay(!enable, this.client.user);

        await interaction.reply({
            content: "Autoplay has been **" + (enable ? "disabled" : "enabled") + "**",
            ephemeral: true
        });
    }
} 
