'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('WeariverseCtrl', function ($scope, Storage, Gist, Socket, $rootScope, $log, $window) {

      function gistList(channel, gists) {
        console.log('Got weariverse gists');
        $window.HACK_WEAR = gists;
        if (typeof gists == 'object') {
          for (var i = 0; i < gists.length; i++)
            gists[i].url_playground = '#/gist/' + gists[i].id;
          $scope.gists = gists;
          $scope.$apply()
        }
      }
      var ws = Socket.ws;
      var channel = ws.channel(ws.groupDevice, 'weariverseList');
      ws.publish_retry(gistList.bind(this), 1000, channel, 'weariverse', 'list', channel);

});
