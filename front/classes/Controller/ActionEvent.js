import Emit from "@utils/Emit";
export default class ActionEvent {
  constructor() {
    this.addEventListeners();
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.load = false;
    this.pressBuffer = 10;
    this.pressHold = 0;
    this.dragbuffer = 5;
    this.Dragging = {
      start: {},
      end: {},
      direction: { x: null, y: null },
      directionChecker:{x:0,y:0},
      down: false,
    };
  }

  onTouchDown(event) {
    if (!this.load) {
      this.pressHoldstart();
      event = this.NormalizedInteract(event);
      this.Dragging.start = { x: event.CLIENTMOUSE.x, y: event.CLIENTMOUSE.y };
      this.Dragging.down = true;
      this.dragbuffer = 5;
      Emit.Emitter.emit(Emit.EmitEvent.TOUCHDOWN, event);
      this.Dragging.currentDirection = { x: null, y: null };
    }
  }

  onTouchMove(event) {
    if (!this.load) {
      event = this.NormalizedInteract(event);
      if (this.Dragging.down && this.dragbuffer <= 0) {
        this.Dragging.end = { x: event.CLIENTMOUSE.x, y: event.CLIENTMOUSE.y };

        this.Dragging.direction = {
          x: this.Dragging.start.x < this.Dragging.end.x ? "right" : "left",
          y: this.Dragging.start.y < this.Dragging.end.y ? "top" : "bottom",
        };


        
        this.Dragging.distance = {
          x: this.Dragging.start.x - this.Dragging.end.x,
          y: this.Dragging.start.y - this.Dragging.end.y,
        };
        this.Dragging.move = event;
        Emit.Emitter.emit(Emit.EmitEvent.DRAGGING, this.Dragging);
      } else if (this.Dragging.down) {
        this.dragbuffer -= 1;
      }

      Emit.Emitter.emit(Emit.EmitEvent.TOUCHMOVE, event);
    }
  }

  onTouchUp(event) {
    if (!this.load) {
      this.pressHoldEnd();
      this.Dragging.down = false;
      event.DRAGGING = this.Dragging;
      Emit.Emitter.emit(Emit.EmitEvent.TOUCHUP, event);
    }
  }

  onWheel(event) {
    if (!this.load) {
      Emit.Emitter.emit(Emit.EmitEvent.WHEEL, event);
    }
  }

  pressHoldstart() {
    clearInterval(this.pressHoldAction);
    this.pressHoldAction = setInterval(() => {
      if (this.Dragging.down && this.dragbuffer > 3 && this.pressBuffer > 0) {
        this.pressBuffer -= 1;
      }
      if (this.Dragging.down && this.pressBuffer === 0 && this.pressHold < 100) {
        this.pressHold += 1;
        Emit.Emitter.emit(Emit.EmitEvent.PRESS_HOLD, this.pressHold);
      }
    }, 10);
  }

  pressHoldEnd() {
    clearInterval(this.pressHoldAction);
    this.pressHoldAction = setInterval(() => {
      if (!this.Dragging.down && this.pressHold > 0) {
        this.pressHold -= 1;
        Emit.Emitter.emit(Emit.EmitEvent.PRESS_HOLD, this.pressHold);
      }
      if (!this.Dragging.down && this.pressHold === 0 && this.pressBuffer < 10) {
        this.pressBuffer = 10;
        clearInterval(this.pressHoldAction);
      }
    }, 10);
  }

  NormalizedInteract(event) {
    this.mouse.x =
      (event.touches ? (event.touches[0].clientX / window.innerWidth) * 2 - 1 : event.clientX / window.innerWidth) * 2 -
      1;
    this.mouse.y =
      -(event.touches ? (event.touches[0].clientY / window.innerHeight) * 2 + 1 : event.clientY / window.innerHeight) *
        2 +
      1;
    event.CLIENTMOUSE = this.mouse;
    event.CLIENTX = event.touches ? event.touches[0].clientX : event.clientX;
    event.CLIENTY = event.touches ? event.touches[0].clientY : event.clientY;
    return event;
  }

  addEventListeners() {
    Emit.Emitter.on(Emit.EmitEvent.WAITSTART, () => (this.load = true));
    Emit.Emitter.on(Emit.EmitEvent.WAITEND, () => (this.load = false));
    window.addEventListener("mousewheel", this.onWheel.bind(this), false);
    window.addEventListener("wheel", this.onWheel.bind(this), false);
    // document.addEventListener("contextmenu", (event) => event.preventDefault());
    window.addEventListener("mousedown", this.onTouchDown.bind(this), false);
    window.addEventListener("mousemove", this.onTouchMove.bind(this), false);
    window.addEventListener("mouseup", this.onTouchUp.bind(this), false);

    window.addEventListener("touchstart", this.onTouchDown.bind(this), false);
    window.addEventListener("touchmove", this.onTouchMove.bind(this), false);
    window.addEventListener("touchend", this.onTouchUp.bind(this), false);
  }

  removeEventListeners() {
    Emit.Emitter.off(Emit.EmitEvent.WAITSTART);
    Emit.Emitter.off(Emit.EmitEvent.WAITEND);
    // document.removeEventListener("contextmenu", (event) => event.preventDefault());
    window.removeEventListener("mousewheel", this.onWheel.bind(this), false);
    window.removeEventListener("wheel", this.onWheel.bind(this), false);

    window.removeEventListener("mousedown", this.onTouchDown.bind(this), false);
    window.removeEventListener("mousemove", this.onTouchMove.bind(this), false);
    window.removeEventListener("mouseup", this.onTouchUp.bind(this), false);

    window.removeEventListener("touchstart", this.onTouchDown.bind(this), false);
    window.removeEventListener("touchmove", this.onTouchMove.bind(this), false);
    window.removeEventListener("touchend", this.onTouchUp.bind(this), false);
  }
}
