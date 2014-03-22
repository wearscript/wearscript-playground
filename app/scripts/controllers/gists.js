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
        Socket.ws.publish(
          'glass',
          'script',
          data.files['glass.html'].content
        );
      })
    }
});
