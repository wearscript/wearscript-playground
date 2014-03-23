'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('LoggingCtrl', function ($scope,Logging) {
    $scope.logs = Logging.ws
  });
