import { ApplicationCommandDataResolvable, ApplicationCommandOptionChoiceData, ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, resolveBase64 } from "discord.js";
import { Bot, Command } from "../structures/client";
import { SearchResult, Track } from "magmastream";

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

        await interaction.deferReply({ ephemeral: true });

        const player =
            this.client.manager.players.get(interaction.guildId)
            || this.client.manager.create({ guild: interaction.guildId, voiceChannel: interaction.member.voice.channelId, textChannel: interaction.channelId, selfDeafen: true });

        const song = interaction.options.getString("song", true);


        const result = await player.search(song, interaction.user);

        if (!result.tracks.length) {
            interaction.editReply({
                content: "No songs found",
            });

            return;
        }

        if (result.loadType === "error") {
            console.error(`error on load request by ${interaction.user.username}`, result);

            interaction.editReply({ content: "An error occurred while loading the song, please contact developer team" });

            return;
        }

        if (result.loadType === "empty") {
            interaction.editReply({ content: "No songs found" });

            return;
        }

        let choice: string = "";

        switch (result.loadType) {
            case "track":
                player.queue.add(result.tracks[0]);

                choice = `${result.tracks[0].title}`;
                break;
            case "playlist":
                player.queue.add(result.tracks);

                choice = `[Playlist] - ${result.playlist?.name}`;
                break;
            case "search":
                player.queue.add(result.tracks[0]);

                choice = `${result.tracks[0].title}`;
                break;
        }

        if (player.state == "DISCONNECTED") {
            player.connect();
        }

        if (!player.playing || player.paused) {
            player.play();
        }

        interaction.editReply({ content: `Added ${choice} to the queue` });
    }

    async autocomplete(interaction: AutocompleteInteraction<"cached">) {
        const query = interaction.options.getFocused();

        let options: ApplicationCommandOptionChoiceData<string>[] = [];

        if (!this.client.manager.nodes.size) {
            interaction.respond([
                {
                    name: "No available nodes... please await",
                    value: "null",
                }
            ]);

            return;
        }

        if (!interaction.member.voice.channelId) {
            interaction.respond(options);
            return;
        }

        let result: SearchResult;

        const player = this.client.manager.players.get(interaction.member.voice.channelId);

        if (!player) result = await this.client.manager.search(query, interaction.user);
        else result = await player.search(query, interaction.user);

        switch (result.loadType) {
            case "empty":
                interaction.respond(options);
                return;
            case "track":
                options = result.tracks.slice(0, 10).map(track => ({ name: track.title.slice(0,100), value: track.uri }));
                break;
            case "search":
                options = result.tracks.slice(0, 10).map(track => ({ name: track.title.slice(0,100), value: track.uri }));
                break;
            case "playlist":
                options.push(
                    {
                        name: `[Playlist] - ${result.playlist?.name}`,
                        value: result.playlist?.name as string,
                    },
                );
                break;
            case "error":
                console.error(`error on load request by ${interaction.user.username}`, result);
                break;
        }

        

        await interaction.respond(options);
    }
}