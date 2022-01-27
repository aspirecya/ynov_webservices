import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Emit from "@utils/Emit"

export default class Canvas {
  constructor() {
    window.CANVAS = this;
    window.TARGET = [];
    this.Scene = new THREE.Scene();
    this.Camera = new Camera(this.Scene);
    this.Renderer = new Renderer(this.Scene, this.Camera);

    this.Scene.add(this.Background.mesh);
    this.Background.mesh.position.y = this.Camera.height;
    Emit.Emitter.emit(Emit.EmitEvent.CANVAS_READY);
    Emit.Emitter.off(Emit.EmitEvent.CANVAS_READY);
    // Setup
  }

  TIME(e) {
    this.Renderer.TIME(e);
  }

  destroy() {
    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    if (this.debug.active) this.debug.gui.destroy();
  }
}
