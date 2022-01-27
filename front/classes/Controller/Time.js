import Emit from "@utils/Emit";
import Stats from "stats.js";
import * as THREE from "three";
export default class Time {
  constructor() {
    // Setup
    // this.start = Date.now();
    // this.current = this.start;
    // this.elapsed = 0;
    // this.delta = 16;
    this.clock = new THREE.Clock();
    if (window.DEBUG) {
      this.stats = new Stats();
      this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this.stats.dom);
    }

    this.tick();
  }

  tick() {
    if (this.stats) this.stats.begin();
    this.elapsed = this.clock.getElapsedTime();
    // const currentTime = Date.now();
    // this.delta = currentTime - this.current;
    // this.current = currentTime;
    // this.elapsed = this.current - this.start;

    Emit.Emitter.emit(Emit.EmitEvent.TIME, {
      elapsed: this.elapsed,
      // current: currentTime,
      // delta: this.delta,
    });

    window.requestAnimationFrame(() => {
      this.tick();
    });
    if (this.stats) this.stats.end();
  }
}
