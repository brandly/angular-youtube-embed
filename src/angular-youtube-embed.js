/* global YT */
angular.module('youtube-embed', ['ng'])
.directive('youtubeVideo', ['$rootScope', '$window', function ($rootScope, $window) {
    var uniqId = 1;

    // adapted from http://stackoverflow.com/a/5831191/1614967
    var youtubeRegexp = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
    var timeRegexp = /t=(\d+)[ms]?(\d+)?s?/;

    function contains(str, substr) {
        return (str.indexOf(substr) > -1);
    }

    // from YT.PlayerState
    var stateNames = {
        '-1': 'unstarted',
        0: 'ended',
        1: 'playing',
        2: 'paused',
        3: 'buffering',
        5: 'queued'
    };

    var eventPrefix = 'youtube.player.';

    function getIdFromURL(url) {
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
                id = pieces[0];
            }
        } else if (contains(id, '#')) {
            // id might look like '93LvTKF_jW0#t=1'
            // and we want '93LvTKF_jW0'
            id = id.split('#')[0];
        }

        return id;
    }

    function getTimeFromURL(url) {
        url = url || '';

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
    }

    // Inject YouTube's iFrame API
    (function () {
        var tag = document.createElement('script');
        tag.src = '//www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }());

    var needsDelay = true;
    var playerCallbacks = [];

    // Youtube callback when API is ready
    $window.onYouTubeIframeAPIReady = function () {
        $rootScope.$apply(function () {
            // we only get one callback thanks to weird YouTube-ness,
            // so if a directive's link fn is processed before this CB,
            // then it gets queued and when execute it now. Otherwise,
            // we tell future directives to not wait.
            angular.forEach(playerCallbacks, function (playerCallback) {
                playerCallback();
            });
            needsDelay = false;
        });
    };

    return {
        restrict: 'EA',
        scope: {
            videoId: '=?',
            videoUrl: '=?',
            player: '=?',
            playerVars: '=?',
            playerHeight: '=?',
            playerWidth: '=?',
        },
        link: function (scope, element, attrs) {
            // player-id attr > id attr > directive-generated ID
            var playerId = attrs.playerId || element[0].id || 'unique-youtube-embed-id-' + uniqId++;
            element[0].id = playerId;

            // Attach to element
            scope.playerHeight = scope.playerHeight || 390;
            scope.playerWidth = scope.playerWidth || 640;
            if (!scope.playerVars) scope.playerVars = {};

            // YT calls callbacks outside of digest cycle
            var applyBroadcast = function () {
                var args = Array.prototype.slice.call(arguments);
                scope.$apply(function () {
                    scope.$emit.apply(scope, args);
                });
            };

            var onPlayerStateChange = function (event) {
                var state = stateNames[event.data];
                if (typeof state !== 'undefined') {
                    applyBroadcast(eventPrefix + state, scope.player, event);
                } else {
                }
                scope.player.currentState = state;
            };

            var onPlayerReady = function (event) {
                if (scope.start) {
                    // scope.player.seekTo(parseInt(scope.start, 10), true);
                }

                applyBroadcast(eventPrefix + 'ready', scope.player, event);
            };

            var createPlayer = function () {
                var p = new YT.Player(playerId, {
                    height: scope.playerHeight,
                    width: scope.playerWidth,
                    videoId: scope.videoId,
                    playerVars: scope.playerVars,
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange
                    }
                });

                p.id = playerId;
                return p;
            };

            var loadPlayer = function () {
                if (playerId && scope.videoId) {
                    if (scope.player && typeof scope.player.destroy === 'function') {
                        scope.player.destroy();
                    }

                    scope.player = createPlayer();
                }
            };

            var setUpPlayer = function () {
                // use URL if you've got it
                if (typeof scope.videoUrl !== 'undefined') {
                    scope.$watch('videoUrl', function (url) {
                        scope.videoId = getIdFromURL(url);

                        var start = getTimeFromURL(url);
                        scope.playerVars.start = scope.playerVars.start || start;

                        loadPlayer();
                    });

                // otherwise, watch the id
                } else {
                    scope.$watch('videoId', function (id) {
                        scope.videoId = id;
                        loadPlayer();
                    });
                }
            };

            if (needsDelay) {
                playerCallbacks.push(setUpPlayer);
            } else {
                // scope.$apply(setUpPlayer);
                setUpPlayer();
            }
        }
    };
}]);
