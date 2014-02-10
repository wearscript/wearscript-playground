'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('ChannelsCtrl', function ($scope,Socket) {
    $scope.update = function () {
        var channels = Socket.channelsExternal();
        var channelsOut = [];
        for (var i in channels) {
            if (channels.hasOwnProperty(i)) {
                channelsOut.push({'device': i, 'channels': channels[i].join(' ')});
            }
        }
        $scope.nameList = channelsOut;
    }
    $scope.update();
  });
