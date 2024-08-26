import { GatewayIntentBits } from "discord.js";
import { Bot } from "./structures/client";

const client = new Bot({
    intents: [GatewayIntentBits.Guilds]
});

client.HandleClientEvents();

client.auth();