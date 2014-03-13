'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('SetupCtrl', function ($scope,$http,Profile) {
      $scope.qrurl = '';
      $scope.adb = '';
      $scope.vimval = Boolean(JSON.parse(localStorage.getItem("vim_mode")));
      $scope.qrsuccess =  function (data) {
          var wsurl = WSURL + "/ws/" + data;
          $scope.qrurl = "https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=" + wsurl +  "&chld=H|4&choe=UTF-8";
          $scope.adb = 'adb shell \"mkdir -p /sdcard/wearscript && echo \'' + wsurl + '\' > /sdcard/wearscript/qr.txt\"'
      }
      $scope.qr = function () {
          $http.post('user/key/ws').success($scope.qrsuccess);
      }
      $scope.vimMode = function() {
          if(localStorage.getItem("vim_mode") === "false") {
            localStorage.setItem("vim_mode", "true");
            $scope.vimval = true;
          } else {
            localStorage.setItem("vim_mode", "false");
            $scope.vimval = false;
          }
      }
}
);
