import { Interaction, Events } from "discord.js";
import { Bot, ClientEvent } from "../../structures/client";

export default class implements ClientEvent {
    name = Events.InteractionCreate;

    constructor(private client: Bot) {};

    run(interaction: Interaction<"cached">) : void {
        if (interaction.isChatInputCommand()) {
            const command = this.client.commands.get(interaction.commandName);

            if (!command) return;

            command.run(interaction);
        }
    }
}