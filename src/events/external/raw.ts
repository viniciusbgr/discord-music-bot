import { Events } from "discord.js";
import { Bot, ClientEvent } from "../../structures/client";

export default class implements ClientEvent {
    name = Events.Raw;

    constructor(private client: Bot) {};

    run(data: any) : void {
        this.client.manager.updateVoiceState(data);
    }
}