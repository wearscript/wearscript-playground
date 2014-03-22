'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('ConnectedCtrl', function ($scope, Socket) {

    $scope.socket = Socket;
    
    
  });
