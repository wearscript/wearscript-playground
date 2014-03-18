'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('EditorCtrl', function ($scope,$http,Profile) {
    $scope.vimval = Profile.get('vim_mode');

     $scope.vimMode = function() {
          Profile.set('vim_mode', $scope.vimval);
      }

  });
