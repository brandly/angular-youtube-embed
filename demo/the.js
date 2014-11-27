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
        video: 'tyubEwigfUY',
        vars: {
            autoplay: 1
        }
    };

    $scope.specifiedTime = {
        url: 'https://www.youtube.com/watch?v=Im4TO03CuF8#t=10s',
        player: null
    };

    $scope.looper = {
        video: 'u2-ZGCoKh-I',
        player: null
    };

    $scope.$on('youtube.player.ended', function ($event, player) {
        if (player === $scope.looper.player) {
            player.playVideo();
        }
    });

    $scope.custom = {
        video: 'FGXDKrUoVrw',
        player: null,
        vars: {
            controls: 0
        }
    };

    $scope.conditional = {
        video: '-m-vVKHideI',
        visible: true,
        toggle: function () {
            this.visible = !this.visible;
        }
    };

    $scope.playlist = {
        vars: {
            list: 'PLISo53ifQd_iBPpybJay-SCAULHsoRicc'
        }
    };
});
