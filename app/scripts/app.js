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
      .when('/setup', {
        templateUrl: 'views/setup.html',
        controller: 'SetupCtrl'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/sensors', {
        templateUrl: 'views/sensors.html',
        controller: 'SensorsCtrl'
      })
      .when('/data', {
        templateUrl: 'views/data.html',
        controller: 'DataCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  .run(function($log,Socket,Profile){
    Socket.connect('ws://wearscript.udderweb.com/ws');

    Socket.onmessage(function(message){
    })

    Socket.onopen(function () {
      ws = new WearScriptConnection(Socket.socket, "playground", Math.floor(Math.random() * 100000));
      ws.subscribe('subscriptions', function(){
        Profile.glass_id = ws.exists('glass')
      });
    })

  });
