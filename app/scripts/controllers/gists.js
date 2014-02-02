'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('GistsCtrl', function ($scope) {
    $scope.update = function () {
        $scope.nameList = window['HACK_GISTS'] || [];
    }
    $scope.update();
  });
