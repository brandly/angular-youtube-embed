var
gulp = require('gulp'),
uglify = require('gulp-uglify'),
karma = require('gulp-karma'),
rename = require('gulp-rename')

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
    gulp.src('src/*')
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

gulp.task('default', ['dist', 'test']);
