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
    .service('youtubePlayerApi', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {
        var service = $rootScope.$new(true);

        // Youtube callback when API is ready
        $window.onYouTubeIframeAPIReady = function () {
            $log.info('Youtube API is ready');
            service.$apply(function () {
                service.ready = true;
            });
        };

        service.ready = false;
        service.playerId = null;
        service.player = null;
        service.videoId = null;
        service.playerHeight = '390';
        service.playerWidth = '640';

        service.bindVideoPlayer = function (elementId) {
            $log.info('Binding to player ' + elementId);
            service.playerId = elementId;
        };

        service.createPlayer = function () {
            $log.info('Creating a new Youtube player for DOM id ' + this.playerId + ' and video ' + this.videoId);
            return new YT.Player(this.playerId, {
                height: this.playerHeight,
                width: this.playerWidth,
                videoId: this.videoId
            });
        };

        service.loadPlayer = function () {
            // API ready?
            if (this.ready && this.playerId && this.videoId) {
                if(this.player) {
                    this.player.destroy();
                }

                this.player = this.createPlayer();
            }
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
                youtubePlayerApi.bindVideoPlayer(element[0].id);

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
