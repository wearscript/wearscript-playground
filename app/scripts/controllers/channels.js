'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('ChannelsCtrl', function ($scope) {
    var channels = HACK_WS.channelsExternal();
    var channelsOut = [];
    for (var i in channels) {
        if (channels.hasOwnProperty(i)) {
            channelsOut.push({'device': i, 'channels': channels[i].join(' ')});
        }
    }
    $scope.nameList = channelsOut;
  });
