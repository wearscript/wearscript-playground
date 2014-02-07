'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('GistsCtrl', function ($scope,$window) {
      var ws = $window.HACK_WS;
      function gist_list_cb(channel, gists) {
          for (var i = 0; i < gists.length; i++)
              gists[i].url_playground = '#/gist/' + gists[i].id;
          window.HACK_GISTS = gists;
          $scope.nameList = gists;
          $scope.$apply(); // HACK(brandyn): Not sure why we have to do this
      }
      function gistcb() {
          if (!ws.exists('gist')) {
              $window.setTimeout(gistcb, 100);
          } else {
              console.log('getting gists')
              ws.subscribe(ws.channel(ws.groupDevice, 'gistList'), gist_list_cb);
              ws.publish('gist', 'list', ws.channel(ws.groupDevice, 'gistList'));
          }
      }
      gistcb();
  });
