'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('SetupCtrl', function ($scope,$http,Profile) {
      $scope.qrurl = '';
      $scope.adb = '';
      $scope.qrsuccess =  function (data) {
          var wsurl = WSURL + "/ws/" + data;
          $scope.qrurl = "https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=" + wsurl +  "&chld=H|4&choe=UTF-8";
          $scope.adb = 'adb shell \"mkdir -p /sdcard/wearscript && echo \'' + wsurl + '\' > /sdcard/wearscript/qr.txt\"'
      }
      $scope.qr = function () {
          $http.post('user/key/ws').success($scope.qrsuccess);
      }
      $scope.vimMode = function() {
          if(!Profile.vim_mode)
            Profile.vim_mode = true;
          else
            Profile.vim_mode = false;
      }
      $scope.vim = Profile.vim_mode;
}
);
