var fs = require('fs');
var gulp = require('gulp');
var exec = require('sync-exec');
var jsonfile = require('jsonfile')
var selenium = require('selenium-standalone');

var msg = 'error-msg';

gulp.task('selenium', function (done) {
  selenium.install({
    logger: function (message) { }
  }, function (err) {
    if (err) return done(err);

    selenium.start(function (err, child) {
      if (err) return done(err);
      selenium.child = child;
      done();
    });
  });
});

gulp.task('integration', ['selenium'], function () {
  if (fs.existsSync(msg)) { fs.unlinkSync(msg); }
  var result = exec('wdio wdio.conf.js');
  if (result.status) {
    jsonfile.writeFileSync(msg, {error: result.stdout});
  }
});

gulp.task('test', ['integration'], function () {
  selenium.child.kill();
});
