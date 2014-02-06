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
      .when('/gist/:gistid', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/gist/:gistid/:file', {
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
      .when('/setup', {
        templateUrl: 'views/setup.html',
        controller: 'SetupCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  .run(function($log,$http,$window,Socket){
      ace.config.set("basePath", "bower_components/ace-builds/src-min-noconflict") ;
      var server
      if ($window.WSURL == "{{.WSUrl}}" ){
        var port = (location.port != 80) ? ':' + location.port : '';
        server = 'ws://' + document.domain + port + '/ws';
      } else {
        server = window.WSURL + '/ws';
      }
      Socket = new ReconnectingWebSocket(server);
      //Socket.connect(WSURL + "/ws");
      $window.HACK_ONCONNECTONCE = [];
      $window.HACK_WS = wearScriptConnectionFactory(Socket, function (connected) {
          console.log('Connected: ' + connected);
          for (var i = 0; i < $window.HACK_ONCONNECTONCE.length; i++) {
              console.log('Running onconnnect')
              $window.HACK_ONCONNECTONCE[i]();
          }
          $window.HACK_ONCONNECTONCE = [];
      });

      if ($window.GLASS_BODY == "{{.GlassBody}}" ){
        $http.get('/example')
          .then(function(res){
            $window.GLASS_BODY = res.data;
          });
      }
  });
