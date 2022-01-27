import Prismic from "@prismicio/client";
import { Client } from "@utils/prismicHelpers";
import Loader from "./Loader";
import LoaderAnimation from "./LoaderAnimation";
import Akira from "@assets/fontsJSON/Akira.typeface.json";
import Emit from "@utils/Emit";
import GSAP from "gsap";
export default class LoadRessources {
  constructor(loadressource = false) {
    if(loadressource){
    new LoaderAnimation();
      this.Init();
    }else{
      GSAP.to("body", 0, { css: { visibility: "visible" } });
      Emit.Emitter.emit(Emit.EmitEvent.LOADER_FINISH);
      Emit.Emitter.emit(Emit.EmitEvent.LOADER_ANIM_FINISH);
    }
  }

  async Init() {
    this.sources = [];
    const { results } = await Client().query(Prismic.Predicates.at("document.type", "controller"));
    this.images = results[0].data.medias;
    this.images.forEach((image, index) => {
      this.sources.push({
        name: image.content.alt,
        type: "texture",
        path: image.content.url,
        width: image.content.dimensions.width,
        height: image.content.dimensions.height,
      });
    });

    this.sources.push({
      name: "Akira",
      type: "fontJSON",
      JSON: Akira,
    });
    this.Loader = new Loader(this.sources);
  }
}
