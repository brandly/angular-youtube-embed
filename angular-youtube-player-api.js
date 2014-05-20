angular.module('youtube', ['ng']).run(function () {
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})
.service('$youtube', ['$window', '$rootScope', function ($window, $rootScope) {
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
                videoId: this.videoId,
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange
                }
            });
        },

        loadPlayer: function () {
            if (this.ready && this.playerId && this.videoId) {
                if (this.player && typeof this.player.destroy === 'function') {
                    this.player.destroy();
                }

                this.player = this.createPlayer();
            }
        }
    };

    // YT calls callbacks outside of digest cycle
    function applyBroadcast (event) {
        $rootScope.$apply(function () {
            $rootScope.$broadcast(event);
        });
    }

    // from YT.PlayerState
    var stateNames = {
        0: 'ended',
        1: 'playing',
        2: 'paused',
        3: 'buffering',
        5: 'queued'
    };

    var eventPrefix = 'youtube.player.';

    function onPlayerReady (event) {
        applyBroadcast(eventPrefix + 'ready');
    }

    function onPlayerStateChange (event) {
        var state = stateNames[event.data];
        if (typeof state !== undefined) {
            applyBroadcast(eventPrefix + state);
        }
    }

    // Youtube callback when API is ready
    $window.onYouTubeIframeAPIReady = function () {
        $rootScope.$apply(function () {
            service.ready = true;
        });
    };

    return service;
}])
.directive('youtubePlayer', ['$youtube', function ($youtube) {
    return {
        restrict: 'EA',
        scope: {
            videoId: '='
        },
        link: function (scope, element, attrs) {
            // Attach to element
            $youtube.playerId = element[0].id;

            // Allow us to watch 'player.ready'
            scope.player = $youtube;
            var stopWatchingReady = scope.$watch('player.ready',
                function (ready) {
                    if (ready) {
                        stopWatchingReady();

                        // Change video, load player
                        scope.$watch('videoId', function (id) {
                            $youtube.videoId = id;
                            $youtube.loadPlayer();
                        });
                    }
            });
        }
    };
}]);
