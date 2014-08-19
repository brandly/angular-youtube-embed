// TODO: write a small app with a couple routes, to display
//    * routing capabilities
//    * video id
//    * video url
//    * various player options

// Create your app with 'youtube-embed' dependency
var myApp = angular.module('myApp', ['youtube-embed', 'ngRoute']);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'demo/the.html',
    controller: 'TheCtrl'
  })
  .when('/advanced', {
    templateUrl: 'demo/advanced.html',
    controller: 'AdvancedCtrl'
  })
  .otherwise('/');
}]);

// Inside your controller...
myApp.controller('TheCtrl', function ($scope) {
    // have a video ID
    $scope.theBestVideo = 'sMKoNBRZM1M';

    // or a URL
    $scope.anotherGoodOne = 'https://www.youtube.com/watch?v=18-xvIjH8T4';
});

myApp.controller('AdvancedCtrl', function ($scope) {
    $scope.selfPlaying = {
        video: 'sMKoNBRZM1M',
        vars: {
            autoplay: 1
        }
    };

    $scope.specifiedTime = {
        url: 'https://www.youtube.com/watch?v=UIFDwgczyA4#t=10s',
        player: null
    };
});
