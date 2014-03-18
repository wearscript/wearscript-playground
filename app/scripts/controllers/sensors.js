'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('SensorsCtrl', function ($scope,$window, Socket) {
      var ws = Socket.ws;
      $scope.sensors = {};
      function sensors_cb(channel, sensorTypes, sensorValues) {
          if (!$scope.sensors.hasOwnProperty(channel))
              $scope.sensors[channel] = {}
          for (var key in sensorValues)
              if (sensorValues.hasOwnProperty(key)) {
                  var values = sensorValues[key];
                  var value = values[values.length - 1];
                  var d = new Date(0);
                  d.setUTCSeconds(value[1]);
                  value[1] = [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
                  $scope.sensors[channel][key] = value;
              }
          console.log('applying: ' + JSON.stringify($scope.sensors));
          $scope.$apply(); // HACK(brandyn): Not sure why we have to do this
      }
      ws.subscribe('sensors', sensors_cb);
      $scope.$on('$destroy', function cleanup() {
          ws.unsubscribe('sensors');
      });
  });
