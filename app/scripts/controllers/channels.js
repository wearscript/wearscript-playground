'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('ChannelsCtrl', function ($scope,Socket) {
      var ws = Socket.ws;
      var channels = ws.channelsExternal();
      var channelsOut = [];
      for (var i in channels) {
          if (channels.hasOwnProperty(i)) {
              channelsOut.push({'device': i, 'channels': channels[i].join(' ')});
          }
      }
      $scope.nameList = channelsOut;
  });
