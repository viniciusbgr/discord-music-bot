import { readdir } from "node:fs/promises";
import { Client, ClientOptions } from "discord.js";
import { Manager } from "magmastream"

interface Event {
    name: string;

    run(): void | Promise<void>;
}

export class Bot extends Client<true> {
    static #folderEventClient = process.cwd() + (process.env.RUN_MODE == "production" ? "/dist" : "/src" ) + "/events/external";
    static #folderEventLavalink = process.cwd() + (process.env.RUN_MODE == "production" ? "/dist" : "/src" ) + "/events/internal";
    #token: string;
    manager: Manager;

    constructor(options: ClientOptions) {
        super(options);

        if (!process.env.DISCORD_TOKEN) throw new Error("DISCORD_TOKEN is not defined in the environment variables.");
        this.#token = process.env.DISCORD_TOKEN;

        if (!process.env.LAVA_LINK_HOST) throw new Error("LAVA_LINK_HOST is not defined in the environment variables.");
        if (!process.env.LAVA_LINK_PORT) throw new Error("LAVA_LINK_PORT is not defined in the environment variables.");
        if (!process.env.LAVA_LINK_PASSWORD) throw new Error("LAVA_LINK_PASSWORD is not defined in the environment variables.");

        this.manager = new Manager({
            nodes: [
                {
                    host: process.env.LAVA_LINK_HOST,
                    port: Number(process.env.LAVA_LINK_PORT),
                    password: process.env.LAVA_LINK_PASSWORD
                },
            ],
            send: (id, payload) => {
                const guild = this.guilds.cache.get(id);

                if (guild) guild.shard.send(payload);
            },
        })
    }

    async HandleClientEvents(): Promise<void> {
        const files = await readdir(Bot.#folderEventClient, { encoding: "utf-8", recursive: true });

        if (!files.length) throw new Error("No client events found.");

        for (const file of files) {
            const { default: property } = await import(Bot.#folderEventClient + "/" + file);

            const event = new property(this) as Event;

            console.log(event);

            if (!event || !event.name) throw new Error("Event name not found.");
            if (!event.run || typeof event.run !== "function") throw new Error("Event run function not found.");

            this.on(event.name, event.run.bind(event));
        }
    }

    async auth(): Promise<void> {
        await this.login(this.#token);
    }
}