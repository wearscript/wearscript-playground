'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('SensorsCtrl', function ($scope,$window) {
      var ws = $window.HACK_WS;
      $scope.sensors = {};
      function sensors_cb(channel, sensorTypes, sensorValues) {
          if (!$scope.sensors.hasOwnProperty(channel))
              $scope.sensors[channel] = {}
          for (var key in sensorValues)
              if (sensorValues.hasOwnProperty(key)) {
                  var values = sensorValues[key];
                  $scope.sensors[channel][key] = values[values.length - 1];
                  $scope.sensors[channel][key].push(key); // HACK(brandyn): How do we use the key in the view for the table?
              }
          $scope.$apply(); // HACK(brandyn): Not sure why we have to do this
      }
      ws.subscribe('sensors', sensors_cb);
      $scope.$on('$destroy', function cleanup() {
          ws.unsubscribe('sensors');
      });
  });
