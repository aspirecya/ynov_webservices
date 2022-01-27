import ActionEvent from "./ActionEvent";
import Debug from "./Debug";
import Routing from "../Routing/Routing";
import Sizes from "./Sizes";
import Device from "./Device";
import Time from "./Time";
import LoadRessources from "../Loader/LoadRessources";
import Canvas from "../Canvas/Canvas";
import Emit from "@utils/Emit";


export default class Controller {
  constructor(router) {
    if (document.querySelector("main") && !document.body.classList.contains("loaded")) {
      console.log("RESET");
      this.Debug = new Debug();
      this.Time = new Time();
      this.Sizes = new Sizes();
      this.LoadRessources = new LoadRessources(false);
      this.Routing = new Routing(router);

     

      Emit.Emitter.on(Emit.EmitEvent.LOADER_ANIM_FINISH, () => {
        // this.Device = new Device();
        this.Canvas = new Canvas();

        this.ActionEvent = new ActionEvent();
        Emit.Emitter.off(Emit.EmitEvent.LOADER_PROGRESS);
        Emit.Emitter.off(Emit.EmitEvent.LOADER_START);
        Emit.Emitter.off(Emit.EmitEvent.LOADER_FINISH);
        Emit.Emitter.off(Emit.EmitEvent.LOADER_ANIM_FINISH);
      });

      document.body.classList.add("loaded");
    }
  }
}
