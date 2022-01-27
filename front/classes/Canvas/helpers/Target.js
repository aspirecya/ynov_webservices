import { ArrayRemover } from "@utils/helpers";
import * as THREE from "three";

import Camera from "../Camera";
import Renderer from "../Renderer";
export default class Target {
  constructor(mesh) {
    this.Scene = new THREE.Scene();
    this.Camera = new Camera(this.Scene);
    this.Renderer = new Renderer(this.Scene, this.Camera);
    this.mesh = mesh;
    this.visible = false;
    this.Scene.add(this.mesh);

    this.Renderer.instance.texture.generateMipmaps = false;
    this.Renderer.instance.texture.wrapS = this.Renderer.instance.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.Renderer.instance.texture.minFilter = THREE.LinearFilter;
    this.Renderer.instance.texture.needsUpdate = true;
    return {
      texture: this.Renderer.instance.texture,
      Scene: this.Scene,
      mesh: this.mesh,
      visible: this.visible,
      Renderer: this.Renderer,
      Camera: this.Camera,
      destroy: () => {
        this.destroy()
      },
      hide: () => {
        this.hide();
      },
      show: () => {
        this.show();
      },
    };
  }

  hide() {
    if (this.visible) {
      this.visible = false;
      window.TARGET = window.TARGET.filter((item) => item !== this);
      this.mesh.visible = false;
      this.Scene.remove(this.mesh);
    }
  }

  show() {
    if (!this.visible) {
      this.visible = true;
      window.TARGET.push(this);
      this.Scene.add(this.mesh);
      this.mesh.visible = true;
    }
  }
  destroy() {
    this.hide();
    this.Renderer = null;
    this.Scene = null;
    this.Camera = null;
  }
}
