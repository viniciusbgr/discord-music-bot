import { Interaction, Events } from "discord.js";
import { Bot, ClientEvent } from "../../structures/client";

export default class implements ClientEvent {
    name = Events.InteractionCreate;

    constructor(private client: Bot) {};

    async run(interaction: Interaction<"cached">) {
        if (interaction.isChatInputCommand()) {
            const command = this.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.run(interaction);
            } catch (err) {
                
                const message = `An error occurred while executing this command\nErr: ${err}`;
                if (interaction.deferred) {
                    await interaction.editReply({
                        content: message,
                    });
                } else {
                    await interaction.reply({
                        content: message,
                        ephemeral: true,
                    });
                }

                console.error(err);
            }
        }

        if (interaction.isAutocomplete()) {
            const command = this.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.autocomplete?.(interaction);
            } catch (err) {
                console.error(err);
            }
        }
    }
}