'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('GistsCtrl', function ($scope, Profile, Socket, $rootScope, $log) {
  $scope.gists = Profile.get('gists')

});
