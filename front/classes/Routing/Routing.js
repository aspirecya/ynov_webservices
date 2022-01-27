import Emit from "@utils/Emit";
import { Nextcheckroutes } from "@utils/helpers";
import Routes from "./Routes";
export default class Routing {
  constructor(router) {
    this.load = false;
    this.NextupdateRouter(router);
    this.addLinkListeners();
    window.INIT = [];
    this.currentPage = Routes[window.TEMPLATE]; // TOUTES LES FONCTIONS EN FONCTION DE LA CURRENT PAGE
    this.previouspath = window.TEMPLATE;

    Emit.Emitter.on(Emit.EmitEvent.LOADER_FINISH, () => {
      Emit.Emitter.on(Emit.EmitEvent.CANVAS_READY, () => {
        this.currentShow();
        this.CreateEmitAction();
        Emit.Emitter.off(Emit.EmitEvent.CANVAS_READY);
      });
    });

    Emit.Emitter.on(Emit.EmitEvent.EMIT_ROUTER, (routing) => {
      this.instantRouting(routing.url);
    });
    Emit.Emitter.on(Emit.EmitEvent.PAGE_ROUTING, ({ URL, popstate }) => {
      this.TRANSISTART({ url: URL, popstate: popstate });
    });
  }

  addLinkListeners() {
    const links = document.querySelectorAll("a");

    links.forEach((link) => {
      link.onclick = (event) => {
        event.preventDefault();
        let { href } = link;

        if (window.TEMPLATE != Nextcheckroutes({ url: href })) {
          this.TRANSISTART({ url: href, popstate: false });
        }
      };
    });
  }

  TRANSISTART({ url, popstate = false }) {
    this.load = true;
    this.previouspath = window.TEMPLATE;
    this.nextpath = Nextcheckroutes({ url });
    Emit.Emitter.emit(Emit.EmitEvent.WAITSTART);

    if (!popstate) {
      Emit.Emitter.on(Emit.EmitEvent.PAGE_TRANSI_HIDECALLBACK, () => {
        Emit.Emitter.off(Emit.EmitEvent.PAGE_TRANSI_HIDECALLBACK);
        this.TRANSIEND(url);
      });
      this.currentHide();
    } else {
      this.TRANSIEND(url);
    }
  }
  async TRANSIEND(url) {
    await this.router.push(url);
    window.TEMPLATE = document.querySelector("main").dataset.template;
    window.VIEW = document.querySelector("main[data-template='" + window.TEMPLATE + "']");
    this.currentPage = Routes[window.TEMPLATE];
    this.addLinkListeners();
    Emit.Emitter.on(Emit.EmitEvent.PAGE_TRANSI_SHOWCALLBACK, () => {
      Emit.Emitter.off(Emit.EmitEvent.PAGE_TRANSI_SHOWCALLBACK);
      Emit.Emitter.emit(Emit.EmitEvent.WAITEND);
      this.load = false;
    });
    this.currentShow();
  }

  currentHide() {
    this.currentPage.forEach((e) => {
      if (e.hide) {
        e.hide(this.nextpath);
      }
    });
  }
  currentShow() {
    this.currentPage.forEach((e) => {
      if (e.show) {
        e.show(this.previouspath);
      }
    });
  }
  NextupdateRouter(router) {
    this.router = router;
    window.TEMPLATE = document.querySelector("main").dataset.template;
    window.VIEW = document.querySelector("main[data-template='" + window.TEMPLATE + "']");
  }
  async instantRouting(url) {
    this.nextpath = Nextcheckroutes({ url });
    await this.router.push(url);
    window.TEMPLATE = document.querySelector("main").dataset.template;
    window.VIEW = document.querySelector("main[data-template='" + window.TEMPLATE + "']");
    this.currentPage = Routes[window.TEMPLATE];
    this.addLinkListeners();
    Emit.Emitter.emit(Emit.EmitEvent.PAGE_TRANSI_SHOWCALLBACK);
  }
  onPopState(e) {
    e.preventDefault();
    this.TRANSISTART({
      url: window.location.pathname,
      popstate: true,
    });
  }

  CreateEmitAction() {
    Emit.Emitter.on(Emit.EmitEvent.PRESS_HOLD, (e) => {
      if(!this.load)
      this.currentPage.forEach((el) => {
        if (el.PRESSHOLD) {
          el.PRESSHOLD(e);
        }
      });
    });
    Emit.Emitter.on(Emit.EmitEvent.TOUCHUP, (e) => {
           if (!this.load)
             this.currentPage.forEach((el) => {
               if (el.TOUCHUP) {
                 el.TOUCHUP(e);
               }
             });
    });
    Emit.Emitter.on(Emit.EmitEvent.TOUCHMOVE, (e) => {
           if (!this.load)
             this.currentPage.forEach((el) => {
               if (el.TOUCHMOVE) {
                 el.TOUCHMOVE(e);
               }
             });
    });
    Emit.Emitter.on(Emit.EmitEvent.TOUCHDOWN, (e) => {
           if (!this.load)
             this.currentPage.forEach((el) => {
               if (el.TOUCHDOWN) {
                 el.TOUCHDOWN(e);
               }
             });
    });
    Emit.Emitter.on(Emit.EmitEvent.DRAGGING, (e) => {
           if (!this.load)
             this.currentPage.forEach((el) => {
               if (el.DRAGGING) {
                 el.DRAGGING(e);
               }
             });
    });
    Emit.Emitter.on(Emit.EmitEvent.WHEEL, (e) => {
           if (!this.load)
             this.currentPage.forEach((el) => {
               if (el.WHEEL) {
                 el.WHEEL(e);
               }
             });
    });
    Emit.Emitter.on(Emit.EmitEvent.TIME, (e) => {
           if (!this.load)
             this.currentPage.forEach((el) => {
               if (el.TIME) {
                 el.TIME(e);
               }
             });
    });
    Emit.Emitter.on(Emit.EmitEvent.SIZES, (e) => {
           if (!this.load)
             this.currentPage.forEach((el) => {
               if (el.SIZES) {
                 el.SIZES(e);
               }
             });
    });
  }
  DestroyEmitAction() {
    Emit.Emitter.off(Emit.EmitEvent.TOUCHUP);
    Emit.Emitter.off(Emit.EmitEvent.TOUCHDOWN);
    Emit.Emitter.off(Emit.EmitEvent.DRAGGING);
    Emit.Emitter.off(Emit.EmitEvent.WHEEL);
    Emit.Emitter.off(Emit.EmitEvent.TIME);
    Emit.Emitter.off(Emit.EmitEvent.SIZES);
  }
}
