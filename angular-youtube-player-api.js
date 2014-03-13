angular.module('youtube', ['ng']).run(function () {
    var tag = document.createElement('script');

    // This is a protocol-relative URL as described here:
    //     http://paulirish.com/2010/the-protocol-relative-url/
    // If you're testing a local page accessed via a file:/// URL, please set tag.src to
    //     "https://www.youtube.com/iframe_api" instead.
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})
.service('youtubePlayerApi', ['$window', '$rootScope', function ($window, $rootScope) {
    var service = {
        // Frame is ready
        ready: false,

        // Element id for player
        playerId: null,

        // Player currently in use
        player: null,

        // Current video id
        videoId: null,

        // Size
        playerHeight: '390',
        playerWidth: '640',

        createPlayer: function () {
            return new YT.Player(this.playerId, {
                height: this.playerHeight,
                width: this.playerWidth,
                videoId: this.videoId
            });
        },
        loadPlayer: function () {
            if (this.ready && this.playerId && this.videoId) {
                if(this.player) {
                    this.player.destroy();
                }

                this.player = this.createPlayer();
            }
        }
    };

    // Youtube callback when API is ready
    $window.onYouTubeIframeAPIReady = function () {
        $rootScope.$apply(function () {
            service.ready = true;
        });
    };

    return service;
}])
.directive('youtubePlayer', ['youtubePlayerApi', function (youtubePlayerApi) {
    return {
        restrict: 'EA',
        scope: {
            videoId: '='
        },
        link: function (scope, element, attrs) {
            // Attach to element
            youtubePlayerApi.playerId = element[0].id;

            // Allow us to watch 'player.ready'
            scope.player = youtubePlayerApi;
            var stopWatchingReady = scope.$watch('player.ready',
                function (ready) {
                    if (ready) {
                        stopWatchingReady();

                        // Change video, load player
                        scope.$watch('videoId', function (id) {
                            youtubePlayerApi.videoId = id;
                            youtubePlayerApi.loadPlayer();
                        });
                    }
            });
        }
    };
}]);
