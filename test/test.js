'use strict'
var expect = require('chai').expect;
var fizzify = require('../index.js');

describe('test func', function() {
  var uaIphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
  var uaIpad = 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
  var uaDesktopChrome = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'

  it('#mobileUserAgent', function(){
    // check for mobile user agent
    var f = fizzify.Fizzify()
    f.setUserAgent(uaIphone)

    expect(uaIphone).to.equal(f.userAgent())

    expect(
      f.deviceInterface()
    ).to.equal(
      fizzify.Fizzify.CONSTANTS.INTERFACE.MOBILE_WEB
    )
    expect(
      f.deviceType()
    ).to.equal(
      fizzify.Fizzify.CONSTANTS.DEVICE_TYPE.MOBILE
    )
  })

  it('#tabletUserAgent', function(){
    // check for mobile user agent
    var f = fizzify.Fizzify()
    f.setUserAgent(uaIpad)

    expect(uaIpad).to.equal(f.userAgent())

    expect(
      f.deviceInterface()
    ).to.equal(
      fizzify.Fizzify.CONSTANTS.INTERFACE.MOBILE_WEB
    )
    expect(
      f.deviceType()
    ).to.equal(
      fizzify.Fizzify.CONSTANTS.DEVICE_TYPE.TABLET
    )
  })

  it('#testIp', function(callback){
    var f = fizzify.Fizzify()
    // 1500ms is needed to retrieve IP
    setTimeout( function() {
      callback()
      expect(
        f.ip()
      ).to.not.equal(
        null
      )
    }, 1500)

  })

  it('#testBrowser', function(){
    var f = fizzify.Fizzify()
    
    f.setUserAgent(uaIpad)
    expect(
      f.browser()
    ).to.equal(
      'SAFARI'
    )


    f.setUserAgent(uaDesktopChrome)
    expect(
      f.browser()
    ).to.equal(
      'CHROME'
    )

  })

})