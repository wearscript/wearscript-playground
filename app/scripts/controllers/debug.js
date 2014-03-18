'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('DebugCtrl', function ($scope,Logging) {
    console.log(Logging.logs)
    $scope.debug = Logging.logs;
  });
