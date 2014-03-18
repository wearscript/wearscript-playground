'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('AnnotationCtrl', function ($scope) {
      var ws = Socket.ws;
      $scope.images = {}; // [device] = imageb64
      function image_cb(channel, time, imageData, numPoints, description) {
          $scope.imageData = 'data:image/jpeg;base64,' + btoa(imageData);
          $scope.numPoints = numPoints;
          $scope.description = description;
          $scope.$apply(); // HACK(brandyn): Not sure why we have to do this
      }
      ws.subscribe('annotationimage', image_cb);
      $scope.$on('$destroy', function cleanup() {
          ws.unsubscribe('annotationimage');
      });
      $scope.
  });
