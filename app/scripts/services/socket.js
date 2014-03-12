'use strict';

angular.module('wearscriptPlaygroundApp')

  .factory( 'Socket', function($rootScope,$log,$window){

    var service = {}
    
    function onopen(){
  
      function log_cb(channel, message) {
        $log.log(channel + ': ' + message);
        // TODO(brandyn): Have a notification that a log message was sent
      }
      function gist_modify_cb(channel, gists) {
        HACK_GIST_MODIFIED = gists;
        $log.log('Gist modified');
      }
      function gist_get_cb(channel, gist) {
        $window.HACK_GIST = gist;
        $log.log(channel + ': ' + gist);
      }
      function urlopen_cb(channel, url) {
        $window.open(url);
      }
      
      function subscription_cb(){
        $log.log('Socket ** Glass Connected: ' + service.exists('glass'));
      }

      $log.log('Socket ** Server Connected');

      service.subscribeTestHandler();
      service.subscribe('subscriptions', subscription_cb);
      service.subscribe('log', log_cb);
      service.subscribe('urlopen', urlopen_cb);
    }

    service.connect = function(url){

      var socket = new ReconnectingWebSocket(url)
      var connect = service.connect

      service = new WearScriptConnection(
        socket,
        "playground",
        Math.floor(Math.random() * 100000),
        onopen
      );

      service.socket = socket
      service.connect = connect
    }

    return service;

});
