// var FirefoxProfile = require('firefox-profile');

// var fp = new FirefoxProfile();
// fp.setPreference("browser.download.folderList",2);
// fp.setPreference("browser.download.manager.showWhenStarting",false);
// fp.setPreference("browser.download.dir", "/tmp");
// fp.setPreference("browser.helperApps.neverAsk.saveToDisk","application/octet-stream");

// fp.encoded(function(bin) { })

var prof = "UEsDBBQACAAIANgiDUcAAAAAAAAAAAAAAAAHAAAAdXNlci5qc5VWyW7bMBC99ysKn1qgZtoEubSnNOmhQIAc0qBHgqJGFmOKQ5AjK/77DiWrsRZvN9l4b/Z5wzpCkD5A8WmhvBe1zxWBUDXh4svHQtkIn398qGdB4FRmIZ/HZQEbZokcG2dR5aJSTq34j1hi87cE90wqkHGr4/RfL493AjcQgsmBoRTqUUC9oxZ5I5TW4KmN6jDWGrcW6MFJeCMITlk2fT1MtLf7jnXQNMZxQofBWBSMT4HOlK63GFUB7TdnL84qYgQVdLlrzrzxlIiLBl0UmUW9tibSucZjyyMMIALEugJZBKykDiqW897+p1KCtUKXoNcPUKja0s+u78dppLIoGhXck7u3GE/Uaw/9xD07bjqmsaq98DxsjPw639RBCyplORY4Xq3ebokVJNuyAav5W9YhDc9CZVjT98wqt14MfeawIUQbBQ8xBs0dQrvvbDqmOVYiNzFtl2ynNK8Dz4pMezSf/V730+o+dORnzezIjG+jMuzBLa5WwzmcxrMH3+nD0amdwh2SKbYvrAfz4TugBsN6pxHL3RYtueZUp/hnlqmnlESeeW9LLqwDTWkDlh7Ckp2xbMwkP2D60sRyu0wC51WMSwtuRWnor29vh23sg2KVjEJZi43MtjLvpp4J07J5XiJPUfD8ygpzZU9MGGhuM21FYSzwl8BguDXSozV6yx5uhgHFMT5SMJrkmDZTvP/UtIMSHGtgmq/27wPLeJTSirpEpy8jN6DWnNf5ASbCZb4sqM1lqQ0Zl3mLdVYZksadX8mNAT4qK1mZt0OndFj6AeFkeGbl0LGqV1BlEJ7bnwc2KonU2pDY7Ud/r3dCNDvhPYXAsgcK2+MTPoV3K9ImPjq/U2yAV97vA5f9VW1U1MF44rveikBbmt/uvtPb2fD7K5b0trvsIq8rv5fEdKkbyPJgWFlk99KQtWNQ5LikhkCptsdInXBKp4htSNjw7p2isCylk/zux/AfrbJNHaVMWAxlVwoZaifJVGkrb0Yn4D333fusQJtDeORnA6NHzZiAc5OUdXFFlR9dux7KDwNW4bsklo7TDHeRN1dt4E86Tmnr03OThY0Lge4KubHEeh9AVcngP1BLBwih+kOQMwMAAJYKAABQSwECLQMUAAgACADYIg1HofpDkDMDAACWCgAABwAAAAAAAAAAACAApIEAAAAAdXNlci5qc1BLBQYAAAAAAQABADUAAABoAwAAAAA=";

exports.config = {
    services: ['selenium-standalone'],
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the location of this
    // file.
    //
    specs: [
        './verify.js'
    ],
    seleniumLogs : "./",
    seleniumArgs: {
      version : "3.141.5",
      drivers : {
        chrome : {
          version : "74.0.3729.6",
          arch    : process.arch,
        }
      }
    },
    seleniumInstallArgs: {
      version : "3.141.5",
      baseURL : "https://selenium-release.storage.googleapis.com",
      drivers : {
        chrome : {
          version : "74.0.3729.6",
          arch    : process.arch,
          baseURL : "https://chromedriver.storage.googleapis.com",
        }
      }
    },
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilties at the same
    // time. Depending on the number of capabilities WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude option in
    // order to group specific specs to a specific capability.
    //
    // If you have trouble getting all important capabilities together check out Sauce Labs
    // platform configurator. A great tool to configure your capabilities.
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: [{
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--headless',
          '--no-sandbox', '--test-type=browser', 
          '--disable-web-security',
          '--safebrowsing-disable-extension-blacklist',
          '--safebrowsing-disable-download-protection'
        ],
        prefs: {
          'safebrowsing.enabled': false,
          'profile.default_content_setting_values': { 'automatic_downloads': 1 },
          'Browser.setDownloadBehavior': {behavior : 'allow', downloadPath: '/tmp/'},
          'download': {
            'prompt_for_download': false,
            'default_directory': '/tmp/',
          },
        },
      },
    }],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity.
    logLevel: 'silent',
    //
    // Enables colors for log output
    coloredLogs: true,
    //
    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './errorShots/',
    //
    // Shorten url command calls by setting a base url. If your url parameter starts with "/"
    // the base url gets prepended.
    baseUrl: 'http://localhost',
    //
    // Default timeout for all waitForXXX commands.
    waitforTimeout: 1000000,
    //
    // Initialise the browser instance with a WebdriverIO plugin. The object should have the
    // plugin name as key and the desired plugin options as property. Make sure you have
    // the plugin installed before running any tests. The following plugins are currently
    // available:
    // WebdriverCSS: https://github.com/webdriverio/webdrivercss
    // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
    // Browserevent: https://github.com/webdriverio/browserevent
    // plugins: {
    //     webdrivercss: {
    //         screenshotRoot: 'my-shots',
    //         failedComparisonsRoot: 'diffs',
    //         misMatchTolerance: 0.05,
    //         screenWidth: [320,480,640,1024]
    //     },
    //     webdriverrtc: {},
    //     browserevent: {}
    // },
    //
    // Framework you want to run your specs with.
    // The following are supported: mocha, jasmine and cucumber
    // see also: http://webdriver.io/guide/testrunner/frameworks.html
    //
    // Make sure you have the node package for the specific framework installed before running
    // any tests. If not please install the following package:
    // Mocha: `$ npm install mocha`
    // Jasmine: `$ npm install jasmine`
    // Cucumber: `$ npm install cucumber`
    framework: 'mocha',
    mochaOpts: {
      timeout: 99999999
    },
    //
    // Test reporter for stdout.
    // The following are supported: dot (default), spec and xunit
    // see also: http://webdriver.io/guide/testrunner/reporters.html
    reporter: 'dot',
    
    //
    // =====
    // Hooks
    // =====
    // Run functions before or after the test. If one of them return with a promise, WebdriverIO
    // will wait until that promise got resolved to continue.
    // see also: http://webdriver.io/guide/testrunner/hooks.html
    //
    // Gets executed before all workers get launched.
    onPrepare: function() {
        // do something
    },
    //
    // Gets executed before test execution begins. At this point you will have access to all global
    // variables like `browser`. It is the perfect place to define custom commands.
    before: function() {
        var chai = require('chai');
        global.expect = chai.expect;
        chai.Should();
    },
    //
    // Gets executed after all tests are done. You still have access to all global variables from
    // the test.
    after: function() {
        // do something
    },
    //
    // Gets executed after all workers got shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    onComplete: function() {
        // do something
    }
};
