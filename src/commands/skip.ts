import { ApplicationCommandDataResolvable, ApplicationCommandOptionType, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { Bot, Command } from "../structures/client";

export default class implements Command {
    data: Partial<ApplicationCommandDataResolvable> = {
        name: "skip",
        description: "skip the current song",
        options: [
            {
                name: "position",
                description: "The position of the song to skip",
                type: ApplicationCommandOptionType.Integer,
                required: false,
                autocomplete: true
            }
        ]
    }
    constructor(private client: Bot) { };

    async run(interaction: ChatInputCommandInteraction<"cached">) {
        if (!interaction.member.voice.channelId) {
            interaction.reply({
                content: "You need to be in a voice channel to skip music",
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

        const position = interaction.options.getInteger("position", false);

        if (!position) {
            player.stop();

            player.play()
            interaction.reply({
                content: "Skipped the current song",
            });

            return;
        }

        if (player.isAutoplay) {
            interaction.reply({
                content: "Autoplay is enabled, you can't skip a position",
            });

            return;
        }

        if (!player.queue.size) {
            interaction.reply({
                content: "No songs in the queue",
            });

            return;
        }

        if (position <= 0 || position > player.queue.size || isNaN(position)) {
            interaction.reply({
                content: "Invalid position",
            });

            return;
        }

        player.stop(position);

        interaction.reply({
            content: `Skipped the song at position **${position}**`,
        });
    }

    async autocomplete(interaction: AutocompleteInteraction<"cached">) {
        if (!interaction.member.voice.channelId) {
            return interaction.respond([])
        }

        const player = this.client.manager.players.get(interaction.guildId);

        const position = interaction.options.getFocused(true);

        if (position.type !== ApplicationCommandOptionType.Integer) return;

        if (!player) {
            interaction.respond([])

            return;
        }

        await interaction.respond(
            player.queue.map((track, index) => ({ name: track.title, value: index }))
        )
    }
}