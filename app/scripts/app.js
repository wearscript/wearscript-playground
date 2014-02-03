'use strict';

angular.module('wearscriptPlaygroundApp', [
  'ngResource',
  'ngRoute',
  'ui.ace',
  'angular-table'
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

  .run(function($log,$http,$window,Socket){
      var server
      if ($window.WSURL == "{{.WSUrl}}" ){
        var port = (location.port != 80) ? ':' + location.port : '';
        server = 'ws://' + document.domain + port + '/ws';
      } else {
        server = window.WSURL + '/ws';
      }
      Socket = new ReconnectingWebSocket(server);
      //Socket.connect(WSURL + "/ws");
      $window.HACK_WS = wearScriptConnectionFactory(Socket, function (connected) {console.log('Connected: ' + connected)});

      if ($window.GLASS_BODY == "{{.GlassBody}}" ){
        $http.get('/example')
          .then(function(res){
            $window.GLASS_BODY = res.data;
          });
      }
  });
