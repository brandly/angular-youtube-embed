# Angular YouTube Embed

> Embed a YouTube player with a simple directive.

```shell
$ bower install --save angular-youtube-mb
```

## Can I use it?

Sure! Let me show you.

```html
<!-- Include the file -->
<script src="angular-youtube-embed.js"></script>
```

```javascript
// Create your app with 'youtube-embed' dependency
var myApp = angular.module('myApp', ['youtube-embed']);
```

```javascript
// Inside your controller...
myApp.controller('MyCtrl', function ($scope) {
  // have a video id
  $scope.theBestVideo = 'sMKoNBRZM1M';
});
```

```html
<!-- Use 'youtube-video' as an element or attribute. -->
<youtube-video video-id="theBestVideo"></youtube-video>
```

It's that simple. [See it in action.](http://brandly.github.io/angular-youtube-embed/)

## But I only have a URL.

No problem.

```javascript
$scope.anotherGoodOne = 'https://www.youtube.com/watch?v=18-xvIjH8T4';
```

```html
<youtube-video video-url="anotherGoodOne"></youtube-video>
```

## Is that it?

Not quite!

### Events and Player Controls

* `youtube.player.ready`
* `youtube.player.ended`
* `youtube.player.playing`
* `youtube.player.paused`
* `youtube.player.buffering`
* `youtube.player.queued`

Events allow you to keep an eye on the state of things from your controller. For example, if you wanted to a watch a video over and over again forever

```javascript
myApp.controller('MyCtrl', function ($scope) {
  $scope.looper = 'VvTvtIeXJ1I';

  $scope.$on('youtube.player.ended', function ($event, player) {
    // play it again
    player.playVideo();
  });
});
```

A full list of `player` methods can be found [here](https://developers.google.com/youtube/iframe_api_reference).

### Utilities

These might be handy.

* `youtubeEmbedUtils.getIdFromURL`
* `youtubeEmbedUtils.getTimeFromURL`

Just inject the service into your controller

```javascript
myApp.controller('MyCtrl', function ($scope, youtubeEmbedUtils) {
  // 'VvTvtIeXJ1I'
  console.log(youtubeEmbedUtils.getIdFromURL('https://www.youtube.com/watch?v=VvTvtIeXJ1I'));
});
```

`getIdFromURL` is covered with [some tests](https://github.com/brandly/angular-youtube-embed/blob/master/test/unit/get-id-from-url.coffee), but [let me know](https://github.com/brandly/angular-youtube-embed/issues/new) if you find any URLs it doesn't support.

### Player Parameters

YouTube's embedded player can take a number of optional parameters. You can find [a full list here](https://developers.google.com/youtube/player_parameters#Parameters).

For example, you could hide the player's controls and have it start automatically. Add `player-vars` to your embedded player.

```html
<youtube-video video-id="theBestVideo" player-vars="playerVars"></youtube-video>
```

And define `playerVars` in your controller.

```javascript
$scope.playerVars = {
    controls: 0,
    autoplay: 1
};
```

Note: `autoplay` won't work on mobile devices.

### Player Size

You can set both `player-width` and `player-height` on the element.

```html
<youtube-video video-id="theBestVideo" player-width="'100%'" player-height="'300px'"></youtube-video>
```

Both values are treated as expressions, which is why the inner single-quotes are need.

Check out [the demo](http://brandly.github.io/angular-youtube-embed) and [the code behind it](https://github.com/brandly/angular-youtube-embed/blob/master/src/demo/the.js).

### Development

First, make sure you have the necessary dependencies installed locally and [gulp](http://gulpjs.com/) installed globally
```shell
$ npm install
$ npm install --global gulp
```

To build a minfied version to `dist/`
```shell
$ gulp dist
```

To host the demo on a local server
```shell
$ gulp host
```

To run a couple tests
```shell
$ gulp test
```

And if you want to do all the aforementioned tasks
```shell
$ gulp
```
