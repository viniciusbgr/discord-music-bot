import { ApplicationCommandDataResolvable, ChatInputCommandInteraction } from "discord.js";
import { Bot, Command } from "../structures/client";

export default class implements Command {
    data: Partial<ApplicationCommandDataResolvable> = {
        name: "stop",
        description: "stop music and i will leave the voice channel"
    }
    constructor(private client: Bot) { };

    async run(interaction: ChatInputCommandInteraction<"cached">) {
        if (!interaction.member.voice.channelId) {
            interaction.reply({
                content: "You need to be in a voice channel to stop music",
                ephemeral: true
            });

            return;
        }

        const player = this.client.manager.players.get(interaction.guildId);

        if (!player) {
            interaction.reply({
                content: "No have player in this server",
                ephemeral: true
            });

            return;
        }

        if (player.state === "DISCONNECTED") {
            interaction.reply({
                content: "The player is disconnected",
                ephemeral: true
            });

            return;
        }

        player.destroy();

        interaction.reply({
            content: "Stopped the music and left the voice channel",
        });
    }
}