const Event = {
  CANVAS_READY: "CANVAS_READY",
  TEST: "TEST",
  /*
   * ACTION
   */
  TIME: "TIME",
  SIZES: "SIZES",
  TOUCHDOWN: "TOUCHDOWN",
  TOUCHUP: "TOUCHUP",
  TOUCHMOVE: "TOUCHMOVE",
  DRAGGING: "DRAGGING",
  WHEEL: "WHEEL",
  PRESS_HOLD: "PRESS_HOLD",
  /*
   * WAIT ACTION
   */
  WAITSTART: "WAITSTART",
  WAITEND: "WAITEND",
  /*
   * LOADER
   */
  LOADER_START: "LOADER_START",
  LOADER_PROGRESS: "LOADER_PROGRESS",
  LOADER_FINISH: "LOADER_FINISH",
  LOADER_ANIM_FINISH: "LOADER_ANIM_FINISH",
  /*
   * WAIT ACTION
   */
  PAGE_ROUTING: "PAGE_ROUTING",
  PAGE_TRANSI_HIDE: "PAGE_TRANSI_HIDE",
  PAGE_TRANSI_HIDECALLBACK: "PAGE_TRANSI_HIDECALLBACK",
  PAGE_TRANSI_SHOW: "PAGE_TRANSI_SHOW",
  PAGE_TRANSI_SHOWCALLBACK: "PAGE_TRANSI_SHOWCALLBACK",
  EMIT_ROUTER: "EMIT_ROUTER",
  /*
   * OVERLAY
   */
  OPEN_CINEMATIC: "OPEN_CINEMATIC",
  NAV_PROGRESS_LOADER: "NAV_PROGRESS_LOADER",
  NAV_PROGRESS_LOAD: "NAV_PROGRESS_LOAD",
  NAV_RESET_LOAD: "NAV_RESET_LOAD",
  NAV_RESET: "NAV_RESET",
  NAV_CLOSEBTN: "NAV_CLOSEBTN",
  NAV_COUNTER: "NAV_COUNTER",
  NAV_UPDATE_COUNTER_CURRENT: "NAV_UPDATE_COUNTER_CURRENT",
  NAV_UPDATE_COUNTER_SUMMARY: "NAV_UPDATE_COUNTER_SUMMARY",
  /*
   * HOME
   */

  HOME_ADD_LISTENERS: "HOME_ADD_LISTENERS",
  HOME_REMOVE_LISTENERS: "HOME_REMOVE_LISTENERS",

  /*
   * PROJECT
   */

  PROJECT_CHANGE: "PROJECT_CHANGE",

  /*
   * ABOUT
   */

  ABOUT_OPEN: "ABOUT_OPEN",
  ABOUT_CLOSE: "ABOUT_CLOSE",
  ABOUT_AFTER_OPEN: "ABOUT_AFTER_OPEN",
  ABOUT_AFTER_CLOSE: "ABOUT_AFTER_CLOSE",
};

export default Event;