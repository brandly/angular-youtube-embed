angular.module('youtube-embed', ['ng']).run(function () {
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})
.service('$youtube', ['$window', '$rootScope', function ($window, $rootScope) {
    // adapted from http://stackoverflow.com/a/5831191/1614967
    var youtubeRegexp = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
    var timeRegexp = /t=(\d+)[ms]?(\d+)?s?/;

    function contains (str, substr) {
        return (str.indexOf(substr) > -1);
    }

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

        currentState: null,

        setURL: function (url) {
            service.videoId = service.getIdFromURL(url);
        },

        getIdFromURL: function (url) {
            var id = url.replace(youtubeRegexp, '$1');

            if (contains(id, ';')) {
                var pieces = id.split(';');

                if (contains(pieces[1], '%')) {
                    // links like this:
                    // "http://www.youtube.com/attribution_link?a=pxa6goHqzaA&amp;u=%2Fwatch%3Fv%3DdPdgx30w9sU%26feature%3Dshare"
                    // have the real query string URI encoded behind a ';'.
                    // at this point, `id is 'pxa6goHqzaA;u=%2Fwatch%3Fv%3DdPdgx30w9sU%26feature%3Dshare'
                    var uriComponent = decodeURIComponent(id.split(';')[1]);
                    id = ('http://youtube.com' + uriComponent)
                            .replace(youtubeRegexp, '$1');
                } else {
                    // https://www.youtube.com/watch?v=VbNF9X1waSc&amp;feature=youtu.be
                    // `id` looks like 'VbNF9X1waSc;feature=youtu.be' currently.
                    // strip the ';feature=youtu.be'
                    id = pieces[0]
                }
            } else if (contains(id, '#')) {
                // id might look like '93LvTKF_jW0#t=1'
                // and we want '93LvTKF_jW0'
                id = id.split('#')[0];
            }

            return id;
        },

        getTimeFromURL: function (url) {
            url || (url = '');

            // t=4m20s
            // returns ['t=4m20s', '4', '20']
            // t=46s
            // returns ['t=46s', '46']
            // t=46
            // returns ['t=46', '46']
            var times = url.match(timeRegexp);

            if (!times) {
                // zero seconds
                return 0;
            }

            // assume the first
            var full = times[0],
                minutes = times[1],
                seconds = times[2];

            // t=4m20s
            if (typeof seconds !== 'undefined') {
                seconds = parseInt(seconds, 10);
                minutes = parseInt(minutes, 10);

            // t=4m
            } else if (contains(full, 'm')) {
                minutes = parseInt(minutes, 10);
                seconds = 0;

            // t=4s
            // t=4
            } else {
                seconds = parseInt(minutes, 10);
                minutes = 0;
            }

            // in seconds
            return seconds + (minutes * 60);
        },

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
        if (typeof state !== 'undefined') {
            applyBroadcast(eventPrefix + state);
        }
        service.currentState = state;
    }

    // Youtube callback when API is ready
    $window.onYouTubeIframeAPIReady = function () {
        $rootScope.$apply(function () {
            service.ready = true;
        });
    };

    return service;
}])
.directive('youtubeVideo', ['$youtube', function ($youtube) {
    return {
        restrict: 'EA',
        scope: {
            videoId: '=',
            videoUrl: '='
        },
        link: function (scope, element, attrs) {
            // Attach to element
            $youtube.playerId = element[0].id;

            var stopWatchingReady = scope.$watch(
                function () {
                    return $youtube.ready
                        // Wait until one of them is defined...
                        && (typeof scope.videoUrl !== 'undefined'
                        ||  typeof scope.videoId !== 'undefined');
                },
                function (ready) {
                    if (ready) {
                        stopWatchingReady();

                        // use URL if you've got it
                        if (typeof scope.videoUrl !== 'undefined') {
                            scope.$watch('videoUrl', function (url) {
                                $youtube.setURL(url);
                                $youtube.loadPlayer();
                            });

                        // otherwise, watch the id
                        } else {
                            scope.$watch('videoId', function (id) {
                                $youtube.videoId = id;
                                $youtube.loadPlayer();
                            });
                        }
                    }
            });
        }
    };
}]);
