'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('SetupCtrl', function ($scope,$http,Profile, $modalInstance) {
    $http.post('user/key/ws').success(function(wskey){
        $scope.wsurl = '';
        $scope.adb = '';
        $scope.imageHeight = '0px'

        if( window.innerWidth < 400){
            $scope.imageHeight = '250px';
        } else {
            $scope.imageHeight = '500px';
        }

        var wsurl = WSURL + "/ws/" + wskey;
        $scope.wsurl = wsurl;
        $scope.adb = 'adb shell \"mkdir -p /sdcard/wearscript && echo \'' + wsurl + '\' > /sdcard/wearscript/qr.txt\"'

        $scope.ok = function () {
            $modalInstance.dismiss('cancel');
        };
    });
  }
);
