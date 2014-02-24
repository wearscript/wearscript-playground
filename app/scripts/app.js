'use strict';

angular.module('wearscriptPlaygroundApp', [
  'ngResource',
  'ngRoute',
  'ui.ace',
  'angular-table',
  'ui.bootstrap.modal',
  'ui.bootstrap.transition'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/gist/:gistid', {
        redirectTo: function(routeParams) {
            return '/gist/' + routeParams.gistid + '/glass.html';
        }
      })
      .when('/gist/:gistid/:file', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/gists', {
        templateUrl: 'views/gists.html',
        controller: 'GistsCtrl'
      })
      .when('/images', {
        templateUrl: 'views/images.html',
        controller: 'ImagesCtrl'
      })
      .when('/sensors', {
        templateUrl: 'views/sensors.html',
        controller: 'SensorsCtrl'
      })
      .when('/channels', {
        templateUrl: 'views/channels.html',
        controller: 'ChannelsCtrl'
      })
      .when('/setup', {
        templateUrl: 'views/setup.html',
        controller: 'SetupCtrl'
      })
      .when('/help', {
        templateUrl: 'views/help.html',
        controller: 'HelpCtrl'
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
      $window.HACK_WS = wearScriptConnectionFactory(Socket, function (connected) {
          console.log('Connected: ' + connected);
      });

      if ($window.GLASS_BODY == "{{.GlassBody}}" ){
        $http.get('/example')
          .then(function(res){
            $window.GLASS_BODY = res.data;
          });
      }
  });
