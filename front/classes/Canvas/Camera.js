import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Emit from "@utils/Emit";
export default class Camera {
  constructor(scene) {
    this.scene = scene;
    this.setInstance();
    Emit.Emitter.on(Emit.EmitEvent.SIZES, (e) => {
      this.SIZES(e);
    });
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera();
    this.instance.position.z = 5;

    this.fov = this.instance.fov * (Math.PI / 180);
    this.instance.aspect = window.innerWidth / window.innerHeight;
    this.instance.updateProjectionMatrix();
    this.scene.add(this.instance);
    this.height = 2 * Math.tan(this.fov / 2) * this.instance.position.z;
    this.width = this.height * this.instance.aspect;
  }

  SIZES(e) {
    this.fov = this.instance.fov * (Math.PI / 180);
    this.instance.aspect = e.width / e.height;
    this.instance.updateProjectionMatrix();
    this.height = 2 * Math.tan(this.fov / 2) * this.instance.position.z;
    this.width = this.height * this.instance.aspect;
  }
}
