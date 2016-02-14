// package metadata file for Meteor.js
var packageName = 'andredeloliveira:angular-youtube-embed';
var where = 'client'; // where to install: 'client' or 'server'. For both, pass nothing.
var version = '1.1.1';
var summary = 'Meteor package for angular-youtube-embed directive for angular 1.x';
var gitLink = 'https://github.com/brandly/angular-youtube-embed';
var documentationFile = 'README.md';

// Meta-data
Package.describe({
  name: packageName,
  version: version,
  summary: summary,
  git: gitLink,
  documentation: documentationFile
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']); // Meteor versions

  api.use('angular:angular@1.2.0', where); // Dependencies
  api.use('stevezhu:lodash@3.5.0', where);
  api.use('angular:angular-mocks@1.2.22', where);
  api.use('adrianliaw:youtube-iframe-api@1.3.122', where);


  api.addFiles('src/angular-youtube-embed.js', where); // Files in use
});   
