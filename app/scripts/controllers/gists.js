'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('GistsCtrl', function ($scope,$window) {
      function gistcb() {
          if (!$window.HACK_GISTS) {
              console.log('not setting names');
              $window.setTimeout(gistcb, 100);
          } else {
              console.log('setting names');
              console.log($window.HACK_GISTS);
              $scope.nameList = $window.HACK_GISTS;
              $scope.$apply(); // HACK(brandyn): Not sure why we have to do this
          }
      }
      gistcb();
  });
