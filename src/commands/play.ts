import { ApplicationCommandDataResolvable, ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";
import { Bot, Command } from "../structures/client";

export default class implements Command {
    data: Partial<ApplicationCommandDataResolvable> = {
        name: "play",
        description: "Play a song",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "song",
                description: "The song to play",
                type: ApplicationCommandOptionType.String,
                required: true,
                autocomplete: true
            }
        ]
    }
    constructor(private client: Bot) { };

    async run(interaction: ChatInputCommandInteraction<"cached">) {
        const song = interaction.options.getString("song", true);

        const result = await this.client.manager.search(song, interaction.user)

        if (!this.client.manager.nodes.size) {
            interaction.reply({
                ephemeral: true,
                content: "No available nodes... please await ",
            });

            return;
        }

        if (!interaction.member.voice.channelId) {
            interaction.reply({
                ephemeral: true,
                content: "You need to be in a voice channel to play music",
            })

            return;
        }

        if (!result.tracks.length) {
            interaction.reply({
                ephemeral: true,
                content: "No songs found",
            });

            return;
        }

        const player =
            this.client.manager.players.get(interaction.guildId)
            || this.client.manager.create({ guild: interaction.guildId, voiceChannel: interaction.member.voice.channelId, textChannel: interaction.channelId, selfDeafen: true });

        player.connect();

        player.queue.add(result.tracks[0]);

        await player.play();

        interaction.reply({
            content: `Queued ${result.tracks[0].title}`,
        });
    }
}