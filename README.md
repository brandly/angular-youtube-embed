# Angular YouTube Embed

> Embed a YouTube player with a simple directive.

```shell
$ bower install --save angular-youtube-mb
```

or

```shell
$ npm install --save angular-youtube-mb
```

## Can I use it?

Sure! Let me show you.

```html
<!-- Include YT library and this directive -->
<script src="https://www.youtube.com/iframe_api"></script>
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

## What about browserify?

If you are using browserify or webpack, make sure you've installed this module:

```shell
$ npm install --save angular-youtube-mb
```

and use it in your code like this:

```javascript
require('angular-youtube-mb');
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
* `youtube.player.error`

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

### Player Functions

Add `player` to embedded youtube player to reference Youtube's video player object to use player functions like `playVideo()`, `stopVideo()`:

```html
<!-- use 'player' to reference player object. -->
<youtube-video video-id="'sMKoNBRZM1M'" player="bestPlayer"></youtube-video>
<!-- perform video playback operations -->
<button ng-click="bestPlayer.playVideo()">Play</button>
<button ng-click="bestPlayer.stopVideo()">Stop</button>
```

Note: `playVideo()`, `loadVideoById()` won't work in all mobile environments until user initiates playback.

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

### Responsive Videos

You'll need to add a few classes to your markup.

```html
<div class="embed-responsive embed-responsive-16by9">
  <youtube-video class="embed-responsive-item" video-id="theBestVideo"></youtube-video>
</div>
```

I took these classes from [Bootstrap](http://getbootstrap.com/components/#responsive-embed), so you might already have them. If not, here they are:

```css
.embed-responsive {
  position: relative;
  display: block;
  height: 0;
  padding: 0;
  overflow: hidden;
}

.embed-responsive.embed-responsive-16by9 {
  padding-bottom: 56.25%;
}

.embed-responsive-item {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
```

Check out [the demo](http://brandly.github.io/angular-youtube-embed) and [the code behind it](https://github.com/brandly/angular-youtube-embed/blob/master/src/demo/the.js).

### Development

First, make sure you have the necessary dependencies installed locally and [gulp](http://gulpjs.com/) installed globally
```shell
$ npm install
$ bower install
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
