import { GatewayIntentBits, Partials } from "discord.js";
import { Bot } from "./structures/client";

const client = new Bot({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates],
    partials: [Partials.Channel, Partials.GuildMember, Partials.User]
});

client.HandleClientEvents().catch(console.error);
client.HandleLavaLinkEvents().catch(console.error);
client.HandleCommands().catch(console.error);

client.auth();