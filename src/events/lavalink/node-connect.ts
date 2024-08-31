import { Node } from "magmastream";
import { Bot } from "../../structures/client";

export default class {
    name = "nodeConnect";

    constructor(private _: Bot) { };

    run(node: Node): void {
        console.log(`Node \"${node.options?.identifier ?? "unknow"}\" connected`);
    }
}
