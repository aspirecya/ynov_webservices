import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import * as THREE from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { LUTPass } from "three/examples/jsm/postprocessing/LUTPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { LUTCubeLoader } from "three/examples/jsm/loaders/LUTCubeLoader.js";

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export default class Postprocessing {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    let RenderTargetClass = null;
    this.ToRenderPass = [];
    if (this.renderer.capabilities.isWebGL2) {
      RenderTargetClass = THREE.WebGLMultisampleRenderTarget;
    } else {
      RenderTargetClass = THREE.WebGLRenderTarget;
    }
    this.lutMap = {
      "Bourbon 64.CUBE": null,
      "Chemical 168.CUBE": null,
      "Clayton 33.CUBE": null,
      "Cubicle 99.CUBE": null,
      "Remy 24.CUBE": null,
    };
    this.params = {
      enabled: false,
      lut: "Cubicle 99.CUBE",
      intensity: 0.5,
      use2DLut: false,
    };
    Object.keys(this.lutMap).forEach((name) => {
      new LUTCubeLoader().load("lut/" + name, function (result) {
        this.lutMap[name] = result;
      });
    });
    const renderTarget = new RenderTargetClass(window.innerWidth, window.innerHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      // encoding: THREE.sRGBEncoding,
    });

    // Effect composer
    this.effectComposer = new EffectComposer(renderer, renderTarget);
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.effectComposer.setSize(window.innerWidth, window.innerHeight);

    // Render pass
    this.renderPass = new RenderPass(scene, camera);
    this.effectComposer.addPass(this.renderPass);



    // this.fxaaPass = new ShaderPass(FXAAShader);

    // const pixelRatio = renderer.getPixelRatio();
    // this.fxaaPass.material.uniforms["resolution"].value.x = 1 / (window.innerWidth * pixelRatio);
    // this.fxaaPass.material.uniforms["resolution"].value.y = 1 / (window.innerHeight * pixelRatio);

    this.lutPass = new LUTPass();
    this.effectComposer.addPass(this.lutPass);
    // this.effectComposer.addPass(this.fxaaPass);
    this.debug();
    // this.effectComposer.addPass(this.renderPass);
  }

  render() {
    this.lutPass.enabled = this.params.enabled && Boolean(this.lutMap[this.params.lut]);
    this.lutPass.intensity = this.params.intensity;
    if (this.lutMap[this.params.lut]) {
      const lut = this.lutMap[this.params.lut];
      this.lutPass.lut = this.params.use2DLut ? lut.texture : lut.texture3D;
    }
    this.effectComposer.render();
  }

  debug() {
    if (window.DEBUG) {
      this.debugFolder = window.DEBUG.addFolder("postprocessing").close();

      if (this.renderer.getPixelRatio() === 1 && this.renderer.capabilities.isWebGL2) {
        this.debugFolder.add(this.params, "use2DLut");
      } else {
        this.params.use2DLut = true;
      }

      const debugfunction = {
        resetclose: () => {},
        close: () => {
          this.close();
        },
        resetanimate: () => {
          this.reset();
        },
      };

      this.debugFolder.add(this.params, "enabled");
      this.debugFolder.add(this.params, "lut", Object.keys(this.lutMap));
      this.debugFolder.add(this.params, "intensity").min(0).max(1);

      this.debugFolder.add(debugfunction, "close");
      this.debugFolder.add(debugfunction, "resetclose");
      this.debugFolder.add(debugfunction, "resetanimate");
    }
  }
}
