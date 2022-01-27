import Page from "@classes/Controller/Page";
import GSAP from "gsap";
import Emit from "@utils/Emit";
export default class TestManager extends Page {
  constructor() {
    super();
  }

  show() {
    GSAP.fromTo(
      this.views,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        onComplete: () => {
          Emit.Emitter.emit(Emit.EmitEvent.PAGE_TRANSI_SHOWCALLBACK);
        },
      }
    );
  }

  hide() {
    window.CANVAS.Background.mesh.position.y = window.CANVAS.Camera.height;
    Emit.Emitter.emit(Emit.EmitEvent.NAV_CLOSEBTN);
    GSAP.to(this.views, {
      opacity: 0,
      onComplete: () => {
        Emit.Emitter.emit(Emit.EmitEvent.PAGE_TRANSI_HIDECALLBACK);
      },
    });
  }

  destroy() {}

  createAnimations() {}
  addEventListeners() {}
}
