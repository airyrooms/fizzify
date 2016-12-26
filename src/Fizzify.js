'use strict'

var CONSTANTS = {
  INTERFACE: {
    WEB: 'WEB',
    MOBILE_WEB: 'MOBILE_WEB'
  },
  DEVICE_TYPE: {
    DESKTOP: 'DESKTOP',
    MOBILE: 'MOBILE',
    TABLET: 'TABLET'
  },
  IP_INFO_PROVIDER: 'https://api.ipify.org?format=json',
  IP_INFO_TIMEOUT: 5000, // timeout for retrieving ip
  REGEX: {
    UA_TYPE: {
      MOBILE: /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,

    },
    UA_MODEL: {
      MOBILE: /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
    },
    UA_BROWSER_TYPE: {
      FIREFOX: /Firefox/i,
      SEAMONKEY: /Seamonkey/i,
      CHROME: /Chrome/i,
      CHROMIUM: /Chromium/i,
      SAFARI: /Safari/i,
      OPERA: /OPR|Opera/i,
      IE: /; MSIE xyz;/i,

    }
  }
}

var request = require('superagent');


/**
 * Create new Fizzify instance. Fizzify must be instantiate on the client in Singleton form.
 * ways for instantiating Fizzify object:
 * `var fiz = new Fizzify();`
 * 
 * or 
 * 
 * `var fiz = new Fizzify(navigator)`
 * 
 * 
 * @class
 * 
 */
function Fizzify(navigator) {
  // use browser navigator as base
  this._navigator = navigator || null;
  this._userAgent = null;
  this._ipObject = null;
  
  /**
   * Set the navigator object that will be used to derivce other attributes.
   * @param {string} navigator - the navigator object
   * 
   */ 
  this.setNavigator = function(navigator) {
    this._navigator = navigator;
    this._userAgent = null;
  }
  
  /**
   * Set the userAgent that will be used to derive other attributes.
   * @param {string} ua - the user agent
   */ 
  this.setUserAgent = function (ua) {
    this._userAgent = ua;
  }

  this.userAgent = function () {
    if (this._userAgent == undefined || this._userAgent == null){
      if (this._navigator != undefined && this._navigator != null && this._navigator != '' && typeof this._navigator === 'object'){
        return this._navigator.userAgent;
      } else {
        return null;
      }
    } else {
      return this._userAgent;
    }
    
  }

  /**
   * Derive device interface from user agent. 
   * possible values of device interface:
   *  - MOBILE_WEB
   *  - WEB
   *  - null
   * 
   * @return {string} deviceInterface
   */ 
  this.deviceInterface = function () {
    var ua = this.userAgent();
    
    if (ua == null)
      return null;

    // get the rules from http://detectmobilebrowsers.com/
    var typeRegex = CONSTANTS.REGEX.UA_MODEL.MOBILE;
    var modelRegex = CONSTANTS.REGEX.UA_TYPE.MOBILE;

    if (typeRegex.test(ua) || modelRegex.test(ua.substr(0, 4))) {
      return CONSTANTS.INTERFACE.MOBILE_WEB;
    } else {
      return CONSTANTS.INTERFACE.WEB;
    }
  }

  /**
   * Derive device type from user agent.
   * possible values of device type:
   *  - MOBILE
   *  - DESKTOP
   *  - null
   * 
   * @return {string} deviceType
   */ 
  this.deviceType = function () {
    var tabletRegex = /android|ipad|playbook|silk/i;

    var ua = this.userAgent();
    if (ua == null)
      return null;
    
    if (this.deviceInterface() == CONSTANTS.INTERFACE.MOBILE_WEB && tabletRegex.test(ua)) {
      return CONSTANTS.DEVICE_TYPE.TABLET;
    } else if(this.deviceInterface() == CONSTANTS.INTERFACE.MOBILE_WEB && !tabletRegex.test(ua)) {
      return CONSTANTS.DEVICE_TYPE.MOBILE
    } else {
      return CONSTANTS.DEVICE_TYPE.DESKTOP
    }
    

  }

  /**
   * Get ip from the current client. default ipProviderUrl is https://api.ipify.org?format=json
   * @param {string} [Optional] ipProviderUrl - custom ip provider to be hitted for getting the client's ip 
   * @return {string} clientIp
   */ 
  this.ip = function (ipProviderUrl) {
    var self = this
    if (ipProviderUrl === undefined){
      ipProviderUrl = CONSTANTS.IP_INFO_PROVIDER
    }
    if (this._ipObject == null) {
      request.get(
        ipProviderUrl
      ).timeout(
        CONSTANTS.IP_INFO_TIMEOUT 
      ).end ( 
        function(err, res) {
          if (res != undefined && res.hasOwnProperty('status') && res.status == 200){
            self._ipObject = res.body;
          }
        }
      )
    }

    if (this._ipObject != undefined &&
        this._ipObject != null && 
        this._ipObject.hasOwnProperty('ip')) {
      return this._ipObject.ip;
    } else {
      return null;
    }
  }

  /**
   * Get the browser name that client used.
   * possible values of browser name:
   *  - CHROME
   *  - FIREFOX
   *  - SEAMONKEY
   *  - SAFARI
   *  - OPERA
   *  - IE
   *  - null 
   * 
   * @return {string} browser
   */ 
  this.browser = function () {
    // taken from rule: https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
    var ua = this.userAgent();
    
    if (ua == null)
      return null;
    
    var regexKeyList = Object.keys(CONSTANTS.REGEX.UA_BROWSER_TYPE);
    for (var regexKey in regexKeyList){
      if (CONSTANTS.REGEX.UA_BROWSER_TYPE[regexKey].test(ua)){
        return regexKey;
      }
    }

    return null;
    
  }

  // run ip() at the moment of the object being constructed
  // because it will take some time before fetching real ip 
  this.ip()
  return this;
}





Fizzify.CONSTANTS = CONSTANTS

module.exports = Fizzify
