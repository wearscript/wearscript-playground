'use strict';

angular.module('wearscriptPlaygroundApp', [
  'ngResource',
  'ngRoute',
  'ui.ace'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/gists', {
        templateUrl: 'views/gists.html',
        controller: 'GistsCtrl'
      })
      .when('/data', {
        templateUrl: 'views/data.html',
        controller: 'DataCtrl'
      })
      .when('/channels', {
        templateUrl: 'views/channels.html',
        controller: 'ChannelsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  .run(function($log,Socket){
      Socket = new ReconnectingWebSocket(WSURL + '/ws');
      //Socket.connect(WSURL + "/ws");
      HACK_WS = wearScriptConnectionFactory(Socket, function (connected) {console.log('Connected: ' + connected)});
  });
