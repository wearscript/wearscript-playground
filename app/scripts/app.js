'use strict';

angular.module('wearscriptPlaygroundApp', [
  'ngResource',
  'ngRoute',
  'ui.ace',
  'angular-table',
  'ui.bootstrap',
  'ui.utils',
  'ngLogging',
  'angular-intro',
  'ui.utils',
  'ja.qr'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/gist/', {
        redirectTo: function(routeParams) {
            return '/';
        }
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
      .when('/help', {
        templateUrl: 'views/help.html',
        controller: 'HelpCtrl'
      })
      .when('/logging', {
        templateUrl: 'views/logging.html',
        controller: 'LoggingCtrl'
      })
      .when('/debug', {
        templateUrl: 'views/debug.html',
        controller: 'DebugCtrl'
      })
      .when('/annotation', {
        templateUrl: 'views/annotation.html',
        controller: 'AnnotationCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($log,$http,$window,$location,$rootScope,Socket,Logging,Editor,Profile, Gist){

    // Globally enable/disable logging
    Logging.enabled = true;

    // Expose profile/path globally for use in templates
    $rootScope.profile = Profile
    if( window.innerWidth < 400){
      Profile.menu = false
    }
    $rootScope.location = $location

    Socket.connect(window.WSURL + '/ws', function(){
      Gist.init()
    });

    $rootScope.aceLoaded = function( editor ) {
      Editor.init(editor)
    }

  });
