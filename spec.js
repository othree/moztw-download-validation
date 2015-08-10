var fs = require('fs');
var util = require('util');
var fetch = require('node-fetch');
var exec = require('sync-exec');
var cheerio = require('cheerio');
var semver = require('semver');

//http://stackoverflow.com/questions/21935696/protractor-e2e-test-case-for-downloading-pdf-file/26127745

var release = 'http://download-installer.cdn.mozilla.net/pub/firefox/releases/';

var latest = '0.0.1';

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
    if (semver.valid(ver) && semver.gt(ver, latest)) {
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
    if (file === 'linux-i686/zh-TW/firefox-' + latest + '.tar.bz2') {
      installers.linux = {
        file: 'firefox-' + latest + '.tar.bz2',
        sha1sum: sum
      };
    }
    if (file === 'mac/zh-TW/Firefox ' + latest + '.dmg') {
      installers.mac = {
        file: 'Firefox ' + latest + '.dmg',
        sha1sum: sum
      };
    }
    if (file === 'win32/zh-TW/Firefox Setup ' + latest + '.exe') {
      installers.win = {
        file: 'Firefox Setup ' + latest + '.exe',
        sha1sum: sum
      };
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

    var filename;
    var installer;

    hash_fetcher.then(function (data) {
      installer = data.win;
      filename  = '/tmp/' + installer.file;
      if (fs.existsSync(filename)) { fs.unlinkSync(filename); }
    });

    browser.driver.wait(function() {
      return !!filename;
    }, 30000).then(function () {
      browser.driver.wait(function() {
        return fs.existsSync(filename);
      }, 30000).then(function() {
        var sha1sum = exec('sha1sum ' + filename.replace(/ /g, '\\ ')).stdout.split(' ')[0].trim();
        expect(sha1sum).toEqual(installer.sha1sum);
        if (fs.existsSync(filename)) { fs.unlinkSync(filename); }
      });
    });

  });

  it('Download OSX Installer', function() {

    $('#download-link-mac').click();

    var filename;
    var installer;

    hash_fetcher.then(function (data) {
      installer = data.mac;
      filename  = '/tmp/' + installer.file;
      if (fs.existsSync(filename)) { fs.unlinkSync(filename); }
    });

    browser.driver.wait(function() {
      return !!filename;
    }, 30000).then(function () {
      browser.driver.wait(function() {
        return fs.existsSync(filename);
      }, 30000).then(function() {
        var sha1sum = exec('sha1sum ' + filename.replace(/ /g, '\\ ')).stdout.split(' ')[0].trim();
        expect(sha1sum).toEqual(installer.sha1sum);
        if (fs.existsSync(filename)) { fs.unlinkSync(filename); }
      });
    });

  });

  it('Download Linux Installer', function() {

    $('#download-link-linux').click();

    var filename;
    var installer;

    hash_fetcher.then(function (data) {
      installer = data.linux;
      filename  = '/tmp/' + installer.file;
      if (fs.existsSync(filename)) { fs.unlinkSync(filename); }
    });

    browser.driver.wait(function() {
      return !!filename;
    }, 30000).then(function () {
      browser.driver.wait(function() {
        return fs.existsSync(filename);
      }, 30000).then(function() {
        var sha1sum = exec('sha1sum ' + filename.replace(/ /g, '\\ ')).stdout.split(' ')[0].trim();
        expect(sha1sum).toEqual(installer.sha1sum);
        if (fs.existsSync(filename)) { fs.unlinkSync(filename); }
      });
    });

  });
});
