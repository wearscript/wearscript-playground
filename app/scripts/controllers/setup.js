'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('SetupCtrl', function ($scope,$http,Profile, $modalInstance) {
    $scope.qrurl = '';
    $scope.adb = '';
    $scope.imageHeight = '0px'
    $scope.qrsuccess =  function (data) {
      if( window.innerWidth < 400){
        $scope.imageHeight = '250px';
      } else {
        $scope.imageHeight = '500px';
      }
      var wsurl = WSURL + "/ws/" + data;
      $scope.qrurl = "https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=" + wsurl +  "&chld=H|4&choe=UTF-8";
      $scope.adb = 'adb shell \"mkdir -p /sdcard/wearscript && echo \'' + wsurl + '\' > /sdcard/wearscript/qr.txt\"'
    }
    $scope.qr = function () {
      console.log("Generating QR Code")
      $http.post('user/key/ws').success($scope.qrsuccess);
    }

    $scope.ok = function () {
      $modalInstance.dismiss('cancel');
    };
  }
);
