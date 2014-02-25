'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('GistsCtrl', function ($scope,$window) {
      var ws = $window.HACK_WS;
      function gist_list_cb(channel, gists) {
          if (typeof gists !== 'object') {
              console.log('Error: gist_list: ' + gists);
              return;
          }
          console.log('callback done');
          console.log(Array.prototype.slice.call(arguments));
          for (var i = 0; i < gists.length; i++)
              gists[i].url_playground = '#/gist/' + gists[i].id;
          window.HACK_GISTS = gists;
          $scope.nameList = gists;
          $scope.$apply(); // HACK(brandyn): Not sure why we have to do this
      }
      var channel = ws.channel(ws.groupDevice, 'gistList');
      console.log('calling publish_rety')
      ws.publish_retry(gist_list_cb.bind(this), 1000, channel, 'gist', 'list', channel);
  });
