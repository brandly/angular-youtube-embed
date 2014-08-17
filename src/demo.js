// TODO: write a small app with a couple routes, to display
//    * routing capabilities
//    * video id
//    * video url
//    * various player options

// Create your app with 'youtube-embed' dependency
var myApp = angular.module('myApp', ['youtube-embed']);

// Inside your controller...
myApp.controller('MyCtrl', function ($scope) {
    // have a video ID
    $scope.theBestVideo = 'sMKoNBRZM1M';

    // or a URL
    $scope.anotherGoodOne = 'https://www.youtube.com/watch?v=18-xvIjH8T4';
});
