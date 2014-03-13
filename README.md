# Angular YouTube

Embed a YouTube player with a simple directive.

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
