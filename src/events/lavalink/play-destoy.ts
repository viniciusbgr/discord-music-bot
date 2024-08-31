import { Player } from "magmastream";

export default class {
    name = "playerDestroy";

    constructor(private _: any) { }

    run(player: Player) {
        console.log(`Player destroy on guild ${player.guild}`);
    }
}
