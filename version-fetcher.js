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
    var ver_frags = node.attribs.href.split('/');
    var ver = ver_frags[ver_frags.length - 2]
    var sver;
    if (/[a-z]/.test(ver)) { return; }
    if (/^\d+$/.test(ver)) { sver = ver + '.0.0'; }
    else if (/^\d+\.\d+$/.test(ver)) { sver = ver + '.0'; }
    else { sver = ver; }
    if (semver.valid(sver) && semver.gt(sver, slatest)) {
      latest = ver;
      slatest = sver;
    }
    console.log(latest)
  });

  fs.writeFileSync('version', latest);
});

