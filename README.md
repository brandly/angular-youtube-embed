# Angular YouTube

> Embed a YouTube player with a simple directive.

## Can I use it?

Sure! Let me show you.

```html
<!-- Include the file -->
<script src="angular-youtube-player-api.js"></script>
```

```javascript
// Create your app with 'youtube' dependency
var myApp = angular.module('myApp', ['youtube']);
```

```javascript
// Inside your controller...
myApp.controller('MyCtrl', function ($scope) {
  // have a video id
  $scope.theBestVideo = 'sMKoNBRZM1M';
});
```

```html
<!-- Use 'youtube-player' as an element or attribute. -->
<!-- Must have an ID -->
<youtube-player id="best-vid" video-id="theBestVideo"></youtube-player>
```

It's that simple. [See it in action.](http://brandly.github.io/angular-youtube/)

## Is that it?

Not quite!

### Events and Player Controls

* `youtube.player.ready`
* `youtube.player.ended`
* `youtube.player.playing`
* `youtube.player.paused`
* `youtube.player.buffering`
* `youtube.player.queued`

Events allow you to keep an eye on the state of things from your controller. For example, let's say you want to automatically play the best video.

```javascript
// Inject '$youtube' dependency
myApp.controller('MyCtrl', function ($scope, $youtube) {
  $scope.theBestVideo = 'sMKoNBRZM1M';

  $scope.$on('youtube.player.ready', function () {
    $youtube.player.playVideo();
  });
});
```

A full list of `$youtube.player` methods can be found [here](https://developers.google.com/youtube/iframe_api_reference).
