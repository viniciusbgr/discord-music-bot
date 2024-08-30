import { readdir } from "node:fs/promises";
import { Collection, ApplicationCommandDataResolvable, ApplicationCommandData, Client, ClientOptions } from "discord.js";
import { Manager, ManagerEvents } from "magmastream"

export interface LavaLinkEvent {
    name: string;

    run(...args: any): void | Promise<void>;
}

export interface ClientEvent {
    name: string;

    run(...args: any): void | Promise<void>;
}

export interface Command {
    data: Partial<ApplicationCommandDataResolvable>;

    run(...args: any): void | Promise<void>;
}

export class Bot extends Client<true> {
    static #folderEventClient = process.cwd() + (process.env.RUN_MODE == "production" ? "/dist" : "/src" ) + "/events/external";
    static #folderEventLavaLink = process.cwd() + (process.env.RUN_MODE == "production" ? "/dist" : "/src" ) + "/events/lavalink";
    static #folderCommands = process.cwd() + (process.env.RUN_MODE == "production" ? "/dist" : "/src" ) + "/commands";
    manager: Manager;
    commands: Collection<string, Command> = new Collection();

    constructor(options: ClientOptions) {
        super(options);

        if (!process.env.LAVA_LINK_HOST) throw new Error("LAVA_LINK_HOST is not defined in the environment variables.");
        if (!process.env.LAVA_LINK_PORT) throw new Error("LAVA_LINK_PORT is not defined in the environment variables.");
        if (!process.env.LAVA_LINK_PASSWORD) throw new Error("LAVA_LINK_PASSWORD is not defined in the environment variables.");

        this.manager = new Manager({
            nodes: [
                {
                    host: process.env.LAVA_LINK_HOST,
                    port: Number(process.env.LAVA_LINK_PORT),
                    password: process.env.LAVA_LINK_PASSWORD,
                    identifier: "Lavalink main"
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

            const event = new property(this) as ClientEvent;

            if (!event || !event.name) throw new Error("Event name not found.");
            if (!event.run || typeof event.run !== "function") throw new Error("Event run function not found.");

            this.on(event.name, (...args: any) => {
                event.run.bind(event)(...args);
            });
        }
    }

    async HandleLavaLinkEvents(): Promise<void> {
        const files = await readdir(Bot.#folderEventLavaLink, { encoding: "utf-8", recursive: true });

        if (!files.length) throw new Error("No lavaLink events found.");

        for (const file of files) {
            const { default: property } = await import(Bot.#folderEventLavaLink + "/" + file);

            const event = new property(this) as LavaLinkEvent;

            if (!event || !event.name) throw new Error("Event name not found.");
            if (!event.run || typeof event.run !== "function") throw new Error("Event run function not found.");

            this.manager.on(event.name as keyof ManagerEvents,(...args: any) => {
                event.run.bind(event)(...args);
            });
        }
    }

    async HandleCommands(): Promise<void> {
        const files = await readdir(Bot.#folderCommands, { encoding: "utf-8", recursive: true });

        if (!files.length) throw new Error("No commands found.");

        for (const file of files) {
            const { default: property } = await import(Bot.#folderCommands + "/" + file);

            const command = new property(this) as Command;

            if (!command || !command.data) throw new Error("Command data not found.");
            if (!command.run || typeof command.run !== "function") throw new Error("Command run function not found.");

            this.commands.set((command.data as ApplicationCommandData).name, command);
        }
    }

    async auth(): Promise<void> {
        await this.login();
    }
}
