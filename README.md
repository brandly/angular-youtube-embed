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
<!-- Must have an ID -->
<youtube-video id="best-vid" video-id="theBestVideo"></youtube-video>
```

It's that simple. [See it in action.](http://brandly.github.io/angular-youtube-embed/)

## But I only have a URL.

No problem.

```javascript
$scope.anotherGoodOne = 'https://www.youtube.com/watch?v=18-xvIjH8T4';
```

```html
<youtube-video id="good-vid" video-url="anotherGoodOne"></youtube-video>
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

A full list of `$youtube.player` methods can be found [here](https://developers.google.com/youtube/iframe_api_reference).

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
<youtube-video id="best-vid" video-id="theBestVideo" player-vars="playerVars"></youtube-video>
```

And define `playerVars` in your controller.

```javascript
$scope.playerVars = {
    controls: 0,
    autoplay: 1
};
```

### Tests

I should write more of them.

```shell
$ npm install
$ npm test
```
