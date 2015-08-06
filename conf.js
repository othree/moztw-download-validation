exports.config = {
  onPrepare: function() {
    browser.ignoreSynchronization = true;
  },
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec.js'],
  multiCapabilities: [{
    browserName: 'chrome',
    'chromeOptions': {
      args: ['--no-sandbox', '--test-type=browser'],
      prefs: {
        'download': {
          'prompt_for_download': false,
          'default_directory': '/tmp/',
        },
      },
    },
  }]
}
