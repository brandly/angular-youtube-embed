'use strict';

/* jasmine specs for services go here */

describe('service', function () {
    beforeEach(module('youtube'));

    it('should react to API ready event', inject(function ($window, youtubePlayerApi) {
        $window.onYouTubeIframeAPIReady();
        expect(youtubePlayerApi.ready).toBe(true);
    }));

    it('should start with default dimensions for player', inject(function (youtubePlayerApi) {
        expect(youtubePlayerApi.playerHeight).toEqual('390');
        expect(youtubePlayerApi.playerWidth).toEqual('640');
    }));

    it('should store the player id when binding', inject(function (youtubePlayerApi) {
        youtubePlayerApi.bindVideoPlayer('ytplayer');
        expect(youtubePlayerApi.playerId).toEqual('ytplayer');
    }));

    it('should load player only when API is ready, player is binded and video ID is set', inject(function (youtubePlayerApi) {
        // API not ready, player not binded
        youtubePlayerApi.ready = false;
        youtubePlayerApi.playerId = null;
        youtubePlayerApi.videoId = null;
        youtubePlayerApi.loadPlayer();
        expect(youtubePlayerApi.player).toEqual(null);

        // Player binded
        youtubePlayerApi.playerId = 'ytplayer';
        youtubePlayerApi.loadPlayer();
        expect(youtubePlayerApi.player).toEqual(null);


        // API ready
        youtubePlayerApi.ready = true;
        youtubePlayerApi.loadPlayer();
        expect(youtubePlayerApi.player).toEqual(null);

        spyOn(youtubePlayerApi, 'createPlayer').andReturn({});

        // Video ID set
        youtubePlayerApi.videoId = 'test';
        youtubePlayerApi.loadPlayer();
        expect(youtubePlayerApi.player).not.toEqual(null);
        expect(youtubePlayerApi.createPlayer).toHaveBeenCalled();
    }));
});
