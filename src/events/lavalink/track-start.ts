import { Player, Track } from "magmastream";
import { Bot } from "../../structures/client";

export default class {
    name = "trackStart";

    constructor(private client: Bot) { }

    run(player: Player, track: Track) {
        const channel = this.client.channels.cache.get(player.textChannel as string)

        if (!channel) {
            console.warn(`Channel not found for track ${track.title}`)

            return;
        }

        if (!channel.isTextBased()) {
            console.warn(`Channel is not text based for track ${track.title}`)

            return;
        }

        channel.send(`Now playing: **[${track.title}](<${track.uri}>) - (${new Date(track.duration).getMinutes()}:${new Date(track.duration).getSeconds()})** > request by **${track.requester}**`)
    }
}
