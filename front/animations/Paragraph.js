import Animation from "@classes/Controller/Page";
import GSAP from "gsap";
import { calculate, split } from "@utils/text";

export default class Paragraph extends Animation {
  constructor({ element }) {
    super({ element });

    this.elementLinesSpans = split({ append: true, element: this.element });
  }

  onResize() {
    this.elementsLines = calculate(this.elementLinesSpans);
  }

  animateIn() {
    this.timelineIn = GSAP.timeline({
      delay: 0.2,
    });
    this.timelineIn.set(this.element, {
      autoAlpha: 1,
    });

    this.elementLinesSpans.forEach((line, index) => {
      this.timelineIn.fromTo(
        line,
        {
          autoAlpha: 0,
          y: "100%",
        },
        {
          autoAlpha: 1,
          delay: index * 0.01,
          y: "0%",
          ease: "expo.out",
        },
        0
      );
    });
  }

  animateOut() {
    if (this.timelineIn) this.timelineIn.pause();

    GSAP.set(this.element, {
      autoAlpha: 0,
    });
  }
}
