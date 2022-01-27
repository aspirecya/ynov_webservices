import GSAP from "gsap";

import { getElements, normalizeValue } from "@utils/helpers";
import Emit from "@utils/Emit";
export default class Page {
  constructor() {
    this.selectorChildren = {
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsLabels: '[data-animation="label"]',
      preloaders: "[data-src]",
    };
  }

  show() {
    this.create();
    this.animationIn = GSAP.timeline();
    GSAP.fromTo(
      this.views,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
      }
    );
    this.animationIn.call((_) => {
      Emit.Emitter.emit(Emit.EmitEvent.PAGE_TRANSI_SHOWCALLBACK);
    });
  }

  hide() {
    GSAP.to(this.views, {
      autoAlpha: 0,
      onComplete: () => {
        this.destroy();
        Emit.Emitter.emit(Emit.EmitEvent.PAGE_TRANSI_HIDECALLBACK);
      },
    });
  }
  create() {
    this.elements = getElements(this.selectorChildren);
    this.views = window.VIEW;
    this.createAnimations();
    this.addEventListeners();
  }
  destroy() {}
  createAnimations() {}
  addEventListeners() {}
}
