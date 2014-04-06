exports.config =
{ seleniumServerJar: '../selenium.jar'
, specs:
  [ '../*.js'
  ]
, capabilities:
  { 'browserName': 'phantomjs'
  }
, jasmineNodeOpts: {
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 5000
  }
}
