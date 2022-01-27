import Emit from "@utils/Emit";
export default class Sizes {
  constructor() {
    this.updateSizes();

    window.addEventListener("resize", () => {
      this.updateSizes();
    });
  }

  updateSizes() {
    Emit.Emitter.emit(Emit.EmitEvent.WAITSTART);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    window.SIZES = { width: this.width, height: this.height, pixelRatio: this.pixelRatio };
    Emit.Emitter.emit(Emit.EmitEvent.SIZES, {
      width: this.width,
      height: this.height,
      pixelRatio: this.pixelRatio,
    });
    Emit.Emitter.emit(Emit.EmitEvent.WAITEND);
  }
}
