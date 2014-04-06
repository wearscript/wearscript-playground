exports.config =
{ seleniumServerJar: '../selenium.jar'
, chromeDriver: '/usr/bin/chromedriver'
, specs:
  [ '../*.js'
  ]
, capabilities:
  { 'browserName': 'chrome'
  }
, jasmineNodeOpts: {
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 5000
  }
}
