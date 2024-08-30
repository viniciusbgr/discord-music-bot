import { Player } from "magmastream";

export default class {
  name = "playerCreate";

  constructor(private _: any) {}

  run(player: Player) {
    console.log(`Player created on guild ${player.guild}`);
  }
}
