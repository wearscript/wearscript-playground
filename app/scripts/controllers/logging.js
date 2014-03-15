'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('LoggingCtrl', function ($scope,Logging) {
    console.log(Logging.logs)
    $scope.logs = Logging.logs;
  });
