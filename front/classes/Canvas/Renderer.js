import * as THREE from "three";

import Emit from "@utils/Emit";
import Postprocessing from "./PostProcessing/Postprocessing";
export default class Renderer {
  constructor(scene, camera) {
    this.camera = camera;
    this.scene = scene;
    this.Main = false;
    this.createRenderParam();
    this.createRender();
    this.material = new THREE.MeshBasicMaterial();
    Emit.Emitter.on(Emit.EmitEvent.SIZES, (e) => {
      this.SIZES(e);
    });
  }
  createRenderParam() {
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.AA = true;
    if (this.pixelRatio > 1) {
      this.AA = false;
    }
  }
  createRender() {
    if (!window.CANVAS?.Renderer?.HTMLCANVAS) {
      this.instance = new THREE.WebGLRenderer({
        alpha: true,
        antialias: this.AA,
        powerPreference: "high-performance",
      });
      // this.instance.autoClear = true;
      this.instance.setClearAlpha(0);
      this.instance.shadowMap.autoUpdate = false;
      this.instance.shadowMap.needsUpdate = true;
      this.instance.setSize(window.innerWidth, window.innerHeight);
      this.instance.setPixelRatio(Math.min(this.pixelRatio, 2));
      this.HTMLCANVAS = document.body.appendChild(this.instance.domElement);

      this.PostProcessing = new Postprocessing(
        this.instance,
        this.scene,
        this.camera.instance
      );
      Emit.Emitter.on(Emit.EmitEvent.TIME, (e) => {
        this.TIME(e);
      });
      this.Main = true;
    } else {
      if (window.CANVAS.Renderer.instance.capabilities.isWebGL2) {
        this.instance = new THREE.WebGLMultisampleRenderTarget(
          window.innerWidth / 2,
          window.innerHeight / 2,
          {
            alpha: false,
            transparent: false,
            antialias: true,
            powerPreference: "high-performance",
          }
        );
      } else {
        this.instance = new THREE.WebGLRenderTarget(
          window.innerWidth / 2,
          window.innerHeight / 2,
          {
            alpha: false,
            transparent: false,
            antialias: true,
            powerPreference: "high-performance",
          }
        );
      }
    }
  }

  SIZES(e) {
    this.instance.setSize(window.innerWidth, window.innerHeight);
    if (this.Main) this.instance.setPixelRatio(Math.min(e.pixelRatio, 2));
  }

  TIME(e) {
    if (this.camera.instance) {
      if (this.Main) {
        if (window.TARGET.length > 0) {
          window.TARGET.forEach((element) => {
          
          
            this.instance.setRenderTarget(element.Renderer.instance);
           
            this.instance.render(element.Scene, element.Camera.instance);
          });
        }
  
        // this.instance.render(this.scene, this.camera.instance);
        this.PostProcessing.render();
      }
    }
  }
}
