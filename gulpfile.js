var
gulp = require('gulp'),
uglify = require('gulp-uglify'),
karma = require('gulp-karma'),
rename = require('gulp-rename'),
express = require('express'),
gutil = require('gulp-util'),
path = require('path'),

build = 'dist/';

gulp.task('test', function () {
    return gulp.src([
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'src/angular-youtube-embed.js',
        'test/unit/**/*.coffee'
    ])
    .pipe(karma({
        configFile: 'test/config/karma.conf.coffee',
        action: 'watch'
    }));
});

gulp.task('gh', function () {
    gulp.src('src/**/*')
    .pipe(gulp.dest('gh-pages'));
});

gulp.task('dist', function () {
    gulp.src('src/angular-youtube-embed.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(build));
});

gulp.task('host', function () {
    var
    app = express(),
    port = 8888;
    app.use(express.static(path.resolve('src/')));
    app.listen(port, function() {
        gutil.log('Listening on', port);
    });
});

gulp.task('default', ['dist', 'host', 'test']);
