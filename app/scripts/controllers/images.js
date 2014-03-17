'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('ImagesCtrl', function ($scope,$window,Socket) {
      var ws = Socket.ws;
      $scope.images = {}; // [device] = imageb64
      function image_cb(channel, time, imageData) {
          $scope.images[channel] = {'url': 'data:image/jpeg;base64,' + btoa(imageData), 'time': time, 'channel': channel};
          $scope.$apply(); // HACK(brandyn): Not sure why we have to do this
      }
      ws.subscribe('image', image_cb);
      $scope.$on('$destroy', function cleanup() {
          ws.unsubscribe('image');
      });
  });
