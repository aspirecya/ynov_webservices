import Emit from "@utils/Emit";
import { getElements, SplitTextSpan, randomizeArray } from "@utils/helpers";
import GSAP from "gsap";

export default class LoaderAnimation {
  constructor() {
    GSAP.to("body", 0, { css: { visibility: "visible" } });
    /*---------------------------------------------
|           Select Elements
-----------------------------------------------*/
    this.elements = getElements({
      loader: ".Loader",
      loaderContainer: ".Loader-stats-container",
      loaderTabStep1: ".Loader .step1 .LoaderText",
      loaderQuoteStep1: ".Loader .step1 .LoaderSubText p",
      loaderTabStep2: ".Loader .step2 .LoaderText",
      loaderQuoteStep2: ".Loader .step2 .LoaderSubText",
      loaderPercent: ".Loader-percent span",
    });
    GSAP.to(this.elements.loaderContainer, {
      opacity: 1,
    });
    this.SplitAction();

    let x = randomizeArray(Array.from(this.TextTabStep1));
    this.showText(x, 0.2);

    Emit.Emitter.on(Emit.EmitEvent.LOADER_PROGRESS, (e) => this.STEP1Progress(e));
    Emit.Emitter.on(Emit.EmitEvent.LOADER_FINISH, (e) => {
      window.setTimeout(() => {
        this.TextTabStep1 = randomizeArray(Array.from(this.TextTabStep1));
        this.TextQuoteStep1 = randomizeArray(Array.from(this.TextQuoteStep1));
        this.hideText(this.TextTabStep1);
        this.hideText(this.TextQuoteStep1);
        GSAP.to(this.elements.loaderPercent, {
          opacity: 0,
        });
        this.STEP2();
      }, 1000);
    });
  }

  STEP1Progress(e) {
    /*---------------------------------------------
|         Illumine les lettre du tab text en fonction du loader %
-----------------------------------------------*/
    let numberofletter = Math.round((e.perc * this.TextTabStep1.length) / 100);
    for (let i = 0; i < numberofletter; i++) {
      GSAP.to(this.TextTabStep1[i], {
        opacity: 1,
        duration: 1,
      });
    }
    this.elements.loaderPercent.innerHTML = Math.round(e.perc) + "%";
    /*---------------------------------------------
|          Quand le loader a fini de load hide le STEP 1
-----------------------------------------------*/
  }

  STEP2() {
    this.TextTabStep2 = randomizeArray(Array.from(this.TextTabStep2));
    this.TextQuoteStep2 = randomizeArray(Array.from(this.TextQuoteStep2));
    this.showText(this.TextTabStep2, 1);
    this.showText(this.TextQuoteStep2, 1);
    window.setTimeout(() => {
      this.hideText(this.TextTabStep2);
      this.hideText(this.TextQuoteStep2);

      window.setTimeout(() => {
        Emit.Emitter.emit(Emit.EmitEvent.OPEN_CINEMATIC);
        this.elements.loader.classList.add("destroy");
        Emit.Emitter.emit(Emit.EmitEvent.LOADER_ANIM_FINISH);

        this.destroyEmitLoader();
      }, 1000);
    }, 3000);
  }

  SplitAction() {
    /*---------------------------------------------
|           Split every Text
-----------------------------------------------*/
    this.elements.loaderTabStep1.innerHTML = SplitTextSpan(this.elements.loaderTabStep1.innerHTML);
    this.elements.loaderQuoteStep1.innerHTML = SplitTextSpan(this.elements.loaderQuoteStep1.innerHTML);

    this.elements.loaderTabStep2.innerHTML = SplitTextSpan(this.elements.loaderTabStep2.innerHTML);
    this.elements.loaderQuoteStep2.innerHTML = SplitTextSpan(document.querySelector("main").dataset.loader);

    this.TextTabStep1 = this.elements.loaderTabStep1.querySelectorAll("span");
    this.TextQuoteStep1 = this.elements.loaderQuoteStep1.querySelectorAll("span");

    this.TextTabStep2 = this.elements.loaderTabStep2.querySelectorAll("span");
    this.TextQuoteStep2 = this.elements.loaderQuoteStep2.querySelectorAll("span");
  }

  hideText(array) {
    array.forEach((element, index) => {
      GSAP.to(element, {
        opacity: 0,
        delay: 0.02 * index,
      });
    });
  }
  showText(array, opacity) {
    array.forEach((element, index) => {
      GSAP.fromTo(
        element,
        {
          opacity: 0,
        },
        {
          opacity: opacity,
          delay: 0.01 * index,
        }
      );
    });
  }
  destroyEmitLoader() {
    Emit.Emitter.off(Emit.EmitEvent.LOADER_START);
    Emit.Emitter.off(Emit.EmitEvent.LOADER_PROGRESS);
    Emit.Emitter.off(Emit.EmitEvent.LOADER_FINISH);
    Emit.Emitter.off(Emit.EmitEvent.LOADER_ANIM_FINISH);
    Emit.Emitter.off(Emit.EmitEvent.OPEN_CINEMATIC);
  }
}
