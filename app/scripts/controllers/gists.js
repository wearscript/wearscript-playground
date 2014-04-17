'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('GistsCtrl', function ($scope, Gist, Socket, $rootScope, $log, $filter, $http) {
    $scope.gists = []
    Gist.list(function(){
      $scope.gists = $filter('orderBy')(Gist.gists,'updated_at',true)
      $scope.$apply()
    })
    $scope.wear = function(gist){
      Gist.get(gist.id,function(channel,data){
        var files = {};
        for (var key in data.files) {
            if (data.files.hasOwnProperty(key))
                files[key] = data.files[key].content;
        }
        Socket.ws.publish(
          'glass',
          'script',
          files
        );
      })
    }
});
