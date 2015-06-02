
var fs = require('fs');
var gulp = require('gulp')
var imageResize = require('gulp-image-resize');
var newer = require('gulp-newer');
var rename = require('gulp-rename');
var Twit = require('twit');
var config = require('./config.js');

var T = new Twit(config);

//var patterns = '*.{jpg,JPG,jpeg,JPEG}';
var sourceDir = '../';
//var sourceDir = 'uploads/';
var resizedDir = sourceDir + 'resized/';

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

gulp.task('resize-watch', function() {
  console.log(sourceDir);
  return gulp.watch(sourceDir + '*', function(event) {
    console.log(event.type);
    if (event.type === 'added' && endsWith(event.path, '.JPG')) {
      gulp.src(event.path)
        // newer() checks if the file is already in gulp.dest() location
        // so we don't re-process files that have already gone through pipeline
       .pipe(newer(resizedDir))
        .pipe(imageResize({
                 width: 4000,
                 height: 4000,
                 upscale: false
              }))
        .pipe(rename(function(path) {
          // honestly this is only for the console.log
          // if we renamed the file, newer() wouldn't work
          console.log('> ' + path.basename);
        }))
        .pipe(gulp.dest(resizedDir));
    }
  });
});

gulp.task('tweet-watch', function() {
  console.log(resizedDir);
  return gulp.watch(resizedDir + '*', function(event) {

    console.log(event.type);
    if (event.type === 'added' && endsWith(event.path, '.JPG')) {
      console.log(event.path);
      var b64content = fs.readFileSync(event.path, {encoding: 'base64'});

      // upload media first so we can reference it in a tweet
      T.post('media/upload', {media: b64content}, function(err, data, response) {

        // now we can reference the media and post a tweet (media will attach to the tweet)
        var mediaIdStr = data.media_id_string;
        var params = {media_ids: [mediaIdStr]};

        T.post('statuses/update', params, function(err, data, response) {

          if (err) {
            console.log('!! ' + err.message);
          } else {
            console.log(data.user.screen_name + ' @ ' + data.created_at);
            console.log('> ' + data.text);
          }

        });
      });
    }
  });
});
