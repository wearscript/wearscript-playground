'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('SetupCtrl', function ($scope,$http,Profile, $modalInstance) {

      $scope.wsurl = '';
      $scope.adb = '';
      $scope.imageHeight = '0px'
      $scope.qrshow = false;
      $scope.qr = function () {
          $http.post('user/key/ws').success(function(wskey){            
              var wsurl = WSURL + "/ws/" + wskey;
              $scope.wsurl = wsurl;
              $scope.adb = 'adb shell \"mkdir -p /sdcard/wearscript && echo \'' + wsurl + '\' > /sdcard/wearscript/qr.txt\"'
              if( window.innerWidth < 400){
                  $scope.imageHeight = '250px';
              } else {
                  $scope.imageHeight = '500px';
              }
              $scope.qrshow = true;
              $scope.apply();
          });
      }

      $scope.ok = function () {
          $modalInstance.dismiss('cancel');
      };
  }
);
