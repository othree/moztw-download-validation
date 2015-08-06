var fs = require('fs');
var exec = require('sync-exec');

var winsha1 = 'd1c67f6898120f4dedd7929ac2b06e78d49a8f2f';

//http://stackoverflow.com/questions/21935696/protractor-e2e-test-case-for-downloading-pdf-file/26127745

describe('MozTW homepage', function() {
  var win = element(by.css('#download-link-win'));

  beforeEach(function() {
    browser.get('http://moztw.org/');
  });

  it('Should Have a Title', function() {
    expect(browser.getTitle()).toEqual('MozTW, Mozilla 台灣社群 | Firefox / Thunderbird 正體中文版');
  });

  it('Download Win32 Installer', function() {

    $('#download-link-win').click();

    var filename  = '/tmp/Firefox Setup 39.0.exe';
    var filenames = '/tmp/Firefox\\ Setup\\ 39.0.exe';

    if (fs.existsSync(filename)) {
      // Make sure the browser doesn't have to rename the download.
      fs.unlinkSync(filename);
    }

    browser.driver.wait(function() {
      return fs.existsSync(filename);
    }, 30000).then(function() {
      var sha1sum = exec('openssl sha1 ' + filenames).stdout.split('= ')[1].trim();
      expect(sha1sum).toEqual(winsha1);
      if (fs.existsSync(filename)) { fs.unlinkSync(filename); }
    });
  });
});
