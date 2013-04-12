basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'test/lib/angular/angular.js',
  'test/lib/angular/angular-mocks.js',
  'angular-youtube-player-api.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
