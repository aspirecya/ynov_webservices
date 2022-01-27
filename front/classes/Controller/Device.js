import MobileDetect from "mobile-detect";

class Device {
  constructor() {
    this.userAgent = window.navigator.userAgent;
    this.mobileDetect = new MobileDetect(this.userAgent);
    window.DEVICE = this.getDeviceType();
  }

  getDeviceType() {
    if (this.mobileDetect.tablet()) {
      return "Tablet";
    } else if (this.mobileDetect.mobile()) {
      return "Mobile";
    } else {
      return "Desktop";
    }
  }

  isIE() {
    return (
      this.userAgent.indexOf("MSIE ") > 0 ||
      this.userAgent.indexOf("Trident/") > 0 ||
      this.userAgent.indexOf("Edge/") > 0
    );
  }
}

export default Device;
