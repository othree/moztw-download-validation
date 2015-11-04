
var fs = require('fs');
var exec = require('sync-exec');

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

chaiAsPromised.transferPromiseness = browser.transferPromiseness;

var hashes = require('./hash-fetcher.js').hashes;

var waitFile = function (path, timeout) {
  return new Promise(function (resolve, reject) {
    var checker = 0;
    var rejecter = setTimeout(function () {
      clearTimeout(checker);
      reject('Timeout'); 
    }, timeout);
    var check = function () {
      checker = setTimeout(function () {
        if (fs.existsSync(path)) {
          clearTimeout(rejecter);
          resolve();
        } else {
          check()
        }
      }, 50);
    };
    check();
  });
};

describe('MozTW', function () {
  this.timeout(1000000);

  beforeEach(function (done) {
    browser.url('https://moztw.org/', done);
  });

  it('Verify Title', function (done) {
    browser
      .getTitle().should.become('MozTW, Mozilla 台灣社群 | Firefox / Thunderbird 正體中文版').notify(done);
  });

  it('Download Win32 Installer', function* () {
    var data = yield hashes;
    var installer = data.win;
    var filename  = '/tmp/' + installer.file;

    if (fs.existsSync(filename)) { fs.unlinkSync(filename); }

    browser.click('#download-link-win');

    yield waitFile(filename, 50000);
    var sha1sum = exec('shasum -a 512 ' + filename.replace(/ /g, '\\ ')).stdout.split(' ')[0].trim();
    sha1sum.should.equal(installer.sha512sum);

    if (fs.existsSync(filename)) { fs.unlinkSync(filename); }
  });

  it('Download OSX Installer', function* () {
    var data = yield hashes;
    var installer = data.mac;
    var filename  = '/tmp/' + installer.file;

    if (fs.existsSync(filename)) { fs.unlinkSync(filename); }

    browser.click('#download-link-mac');

    yield waitFile(filename, 50000);
    var sha1sum = exec('shasum -a 512 ' + filename.replace(/ /g, '\\ ')).stdout.split(' ')[0].trim();
    sha1sum.should.equal(installer.sha512sum);

    if (fs.existsSync(filename)) { fs.unlinkSync(filename); }
  });

});

