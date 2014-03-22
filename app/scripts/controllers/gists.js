'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('GistsCtrl', function ($scope, Gist, Socket, $rootScope, $log, $filter) {
  Gist.list(function(){
    $scope.gists = $filter('orderBy')(Gist.gists,'udated_at',true)
  })
});
