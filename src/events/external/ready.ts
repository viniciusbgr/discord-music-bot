import { Bot } from "../../structures/client";

export default class {
    public name = "ready";

    constructor(private client: Bot) {};

    run() : void {
        this.client.manager.init(this.client.user.id);

        console.log(`Logged in as ${this.client.user.tag}`);
    }
}