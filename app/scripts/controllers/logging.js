'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('LoggingCtrl', function ($scope,Logging) {
    Logging.ws = Logging.ws || []
    $scope.logs = Logging.ws;
  });
