'use strict';

angular.module('wearscriptPlaygroundApp', [
  'ngResource',
  'ngRoute',
  'ui.ace',
  'angular-table',
  'ui.bootstrap',
  'ngTouch',
  'ngLogging'
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
      .when('/weariverse', {
        templateUrl: 'views/weariverse.html',
        controller: 'WeariverseCtrl'
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
      .when('/logging', {
        templateUrl: 'views/logging.html',
        controller: 'LoggingCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($log,$http,$window,$rootScope,Socket,Logging,Editor){
    // Globally enable/disable logging
    Logging.enabled = true;
    Socket.connect(window.WSURL + '/ws');
    $window.HACK_WS = Socket.ws;
    $rootScope.aceLoaded = function( editor ) {
      Editor.init(editor)
    }
  });
