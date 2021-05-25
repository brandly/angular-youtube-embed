const { src, dest, series } = require('gulp')
const uglify = require('gulp-uglify')
const karma = require('gulp-karma')
const rename = require('gulp-rename')
const header = require('gulp-header')
const express = require('express')
const gutil = require('gulp-util')
const path = require('path')
const package = require('./bower')

build = 'dist/',

banner = [
  '/*',
  '  <%= package.name %> v<%= package.version %>',
  '  <%= package.homepage %>',
  '*/',
  ''
].join('\n');

function test () {
    return src([
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'src/angular-youtube-embed.js',
        'test/unit/**/*.coffee'
    ])
    .pipe(karma({
        configFile: 'test/config/karma.conf.coffee',
        action: 'watch'
    }));
}

function dist () {
    return src('src/angular-youtube-embed.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(header(banner, {package: package}))
        .pipe(dest(build));
}

function host () {
    var
    app = express(),
    port = 8888;
    app.use(express.static(path.resolve('src/')));
    app.listen(port, function() {
        gutil.log('Listening on', port);
    });
}

exports.dist = dist
exports.host = host
exports.test = test
exports.default = series(dist, host, test)
