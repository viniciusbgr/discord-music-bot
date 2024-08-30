import { Bot, ClientEvent } from "../../structures/client";
import { VoiceState } from "discord.js";

export default class implements ClientEvent {
    name = "voiceStateUpdate";

    constructor(private client: Bot) { }

    run(oldState: VoiceState, newState: VoiceState) {
        if (oldState.member?.user.bot || newState.member?.user.bot) return;

        if (oldState.channelId && !newState.channelId) {
            this.client.manager.players.get(oldState.channelId)?.destroy();

            return;
        }

        const voiceChannel = newState.channel;

        if (!voiceChannel) return;

        const player = this.client.manager.players.get(voiceChannel.id);

        if (!player) return;

        if (!voiceChannel.members.filter(member => !member.user.bot).size) {
            player.destroy(true);

            return
        }

        if (voiceChannel.id !== player.voiceChannel) {
            player.setVoiceChannel(voiceChannel.id)
        }
    }
}
