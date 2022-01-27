import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import Emit from "@utils/Emit";
import { limitNumberWithinRange } from "@utils/helpers";

export default class Loader {
  constructor(sources) {
    this.sources = sources;
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.perc = 0;
    window.TEXTURE = [];
    window.FONT = [];
    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.loaders.fontLoader = new FontLoader();
  }

  startLoading() {
    this.interval = setInterval(() => {
      this.progress();
    }, 20);
    // Load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          file.magFilter = THREE.NearestFilter;
          file.minFilter = THREE.NearestFilter;
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          window.TEXTURE[source.name] = file;

          file.minFilter = THREE.LinearFilter;
          file.generateMipmaps = false;
          const media = new window.Image();

          media.crossOrigin = "anonymous";
          media.src = source.path;

          media.onload = (_) => {
            window.TEXTURE[source.name].IMAGET = {
              width: media.width,
              height: media.height,
            };
            window.TEXTURE[source.name].PATH = source.path;
            window.TEXTURE[source.name].ALT = source.name;
            this.sourceLoaded();
          };
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "fontJSON") {
        let file = this.loaders.fontLoader.parse(source.JSON);

        window.FONT[source.name] = file;
        this.sourceLoaded(source, file);
      }
    }
  }

  progress() {
    if (this.perc >= (this.loaded / this.toLoad) * 100) {
      clearInterval(this.interval);
      this.interval = 0;
      Emit.Emitter.emit(Emit.EmitEvent.LOADER_FINISH);
    }
    if (this.perc < (this.loaded / this.toLoad) * 100) {
      this.perc += 1;
      Emit.Emitter.emit(Emit.EmitEvent.LOADER_PROGRESS, {
        progress: this.loaded,
        toLoad: this.toLoad,
        percent: (this.loaded / this.toLoad) * 100,
        perc: this.perc,
      });
    }
  }
  sourceLoaded(source, file) {
    this.loaded++;
  }
}
