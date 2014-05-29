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
$scope.theBestVideo = 'https://www.youtube.com/watch?v=sMKoNBRZM1M';
```

```html
<youtube-video id="best-vid" video-url="theBestVideo"></youtube-video>
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

### Utilities

* `$youtube.getIdFromURL`
* `$youtube.getTimeFromURL`

For example, you could start your video at the URL-specified time.

```javascript
$scope.$on('youtube.player.ready', function () {
    var time = $youtube.getTimeFromURL($scope.videoURL);
    $youtube.player.seekTo(time, true);
    $youtube.player.playVideo();
});
```

### Tests

I should write more of them.

```shell
$ npm install
$ bower install
$ gulp test
```
