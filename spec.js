var fetch = require('node-fetch');
var fs = require('fs');
var exec = require('sync-exec');
var cheerio = require('cheerio');
var semver = require('semver');

var winsha1 = 'd1c67f6898120f4dedd7929ac2b06e78d49a8f2f';

//http://stackoverflow.com/questions/21935696/protractor-e2e-test-case-for-downloading-pdf-file/26127745

var release = 'http://download-installer.cdn.mozilla.net/pub/firefox/releases/';

var latest;

var hash_fetcher = fetch(release).then(function (response) {
  if (!response.ok) {
    throw new Error('Release list not get');
  }
  return response.text();
}).then(function (body) {
  var links = cheerio.load(body)('a');

  links.map(function (i, node) {
    var ver = node.attribs.href;
    ver = ver.substr(0, ver.length - 1);
    if (semver.valid(ver)) {
      latest = ver;
    }
  });

  return latest;
}).then(function (latest) {
  return fetch(release + latest + '/SHA1SUMS');
}).then(function (response) {
  if (!response.ok) {
    throw new Error('Release list not get');
  }
  return response.text();
}).then(function (text) {
  var installers = {};
  var tuples = text.split("\n");
  var i, tuple, file, sum;
  for (i in tuples) {
    tuple = tuples[i].split(' ');
    sum = tuple.shift().trim();
    file = tuple.join(' ').trim();
    if (file === 'linux-x86_64/zh-TW/firefox-' + latest + '.tar.bz2') {
      installers.linux = sum;
    }
    if (file === 'mac/zh-TW/Firefox ' + latest + '.dmg') {
      installers.mac = sum;
    }
    if (file === 'win32/zh-TW/Firefox Setup Stub ' + latest + '.exe') {
      installers.win = sum;
    }
  }
  return installers;
});

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
      var sha1sum = exec('sha1sum ' + filenames).stdout.split(' ')[0].trim();
      expect(sha1sum).toEqual(winsha1);
      if (fs.existsSync(filename)) { fs.unlinkSync(filename); }
    });
  });
});
