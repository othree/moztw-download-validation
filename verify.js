var fs = require("fs");
var exec = require("sync-exec");

var hashes = require("./hash-fetcher.js").hashes;

var waitFile = (path, timeout) => {
  return new Promise(function(resolve, reject) {
    var checker = 0;
    var rejecter = setTimeout(function() {
      clearTimeout(checker);
      reject("Timeout");
    }, timeout);
    var check = function() {
      checker = setTimeout(function() {
        if (fs.existsSync(path)) {
          clearTimeout(rejecter);
          resolve();
        } else {
          check();
        }
      }, 50);
    };
    check();
  });
};

describe("MozTW", () => {
  browser.sendCommand("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: "/tmp/"
  });

  beforeEach(async () => {
    return await browser.url("https://moztw.org/");
  });

  it("Verify Title", async () => {
    const title = await browser.getTitle();
    title.should.equal(
      "MozTW, Mozilla 台灣社群 | Firefox / Thunderbird 正體中文版"
    );
  });

  it("Download Win32 Installer", async () => {
    var data = await hashes;
    var installer = data.win;
    var filename = "/tmp/" + installer.file;

    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }

    const link = await $("#download-link-win");
    link.click();

    await waitFile(filename, 50000);
    var sha1sum = exec("shasum -a 512 " + filename.replace(/ /g, "\\ "))
      .stdout.split(" ")[0]
      .trim();
    sha1sum.should.equal(installer.sha512sum);

    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }
  });

  it("Download OSX Installer", async () => {
    var data = await hashes;
    var installer = data.mac;
    var filename = "/tmp/" + installer.file;

    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }

    const link = await $("#download-link-mac");
    link.click();

    await waitFile(filename, 50000);
    var sha1sum = exec("shasum -a 512 " + filename.replace(/ /g, "\\ "))
      .stdout.split(" ")[0]
      .trim();
    sha1sum.should.equal(installer.sha512sum);

    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }
  });
});
