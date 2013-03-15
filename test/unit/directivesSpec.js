'use strict';

/* jasmine specs for directives go here */

describe('directives', function () {
    beforeEach(module('youtube'));

    describe('youtubePlayer', function () {
        it('should bind the DOM element for Youtube player to the service', inject(function ($compile, $rootScope, youtubePlayerApi) {
            $compile('<div id="ytplayer" youtube-player></div>')($rootScope);
            expect(youtubePlayerApi.playerId).not.toEqual(null);
        }));
    });
});