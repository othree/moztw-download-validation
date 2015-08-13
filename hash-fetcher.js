var fs = require('fs');
var util = require('util');
var fetch = require('node-fetch');
var exec = require('sync-exec');
var cheerio = require('cheerio');
var semver = require('semver');

//http://stackoverflow.com/questions/21935696/protractor-e2e-test-case-for-downloading-pdf-file/26127745

var release = 'http://download-installer.cdn.mozilla.net/pub/firefox/releases/';

var latest = '0.0.1';
var slatest = '0.0.1';

var hash_fetcher = fetch(release).then(function (response) {
  if (!response.ok) {
    throw new Error('Release list not get');
  }
  return response.text();
}).then(function (body) {
  var links = cheerio.load(body)('a');

  links.map(function (i, node) {
    var ver = node.attribs.href;
    var sver;
    ver = ver.substr(0, ver.length - 1);
    if (/^\d+$/.test(ver)) { sver = ver + '.0.0'; }
    else if (/^\d+\.\d+$/.test(ver)) { sver = ver + '.0'; }
    else { sver = ver; }
    if (semver.valid(sver) && semver.gt(sver, slatest)) {
      latest = ver;
      slatest = sver;
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

exports.hashes = hash_fetcher;
