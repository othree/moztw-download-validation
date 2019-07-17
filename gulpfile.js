var fs = require('fs');
var gulp = require('gulp');
var exec = require('sync-exec');
var jsonfile = require('jsonfile')

var msg = 'error-msg';

gulp.task('test', function (done) {
  if (fs.existsSync(msg)) { fs.unlinkSync(msg); }
  var result = exec('npx wdio wdio.conf.js');
  if (result.status) {
    jsonfile.writeFileSync(msg, {error: result.stdout});
  }

  done();
});
