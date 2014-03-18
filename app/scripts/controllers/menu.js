'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('MenuCtrl', function ($scope, $log, Profile) {
    $scope.debugMode = Profile.debug_mode

    $scope.setDebugMode = function(){
      Profile.set('debug_mode', $scope.debugMode)
      $log.log($scope.debugMode);
    }
  });
