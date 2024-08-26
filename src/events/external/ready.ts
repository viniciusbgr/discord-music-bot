import { ApplicationCommandDataResolvable, Events } from "discord.js";
import { Bot, ClientEvent } from "../../structures/client";

export default class implements ClientEvent {
    name = Events.ClientReady;

    constructor(private client: Bot) {};

    run() : void {
        this.client.manager.init(this.client.user.id);

        this.client.application?.commands.set(this.client.commands.map(command => command.data as ApplicationCommandDataResolvable));

        console.log(`Logged in as ${this.client.user.tag}`);
    }
}