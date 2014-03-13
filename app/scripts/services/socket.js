'use strict';

angular.module('wearscriptPlaygroundApp')

  .factory( 'Socket', function($rootScope,$log,$window){

    var service = {}
    
    function onopen(){

      $log.log('Socket ** Server Connected');
      $rootScope.$broadcast('connected')
  
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
      
      function subscription_cb(foo){
        $rootScope.$broadcast('subscription')
        if (service.ws.exists('glass')){
            $log.log('Socket ** Glass Connected');
            $rootScope.$broadcast('glass')
        }
      }

      service.ws.subscribeTestHandler();
      service.ws.subscribe('subscriptions', subscription_cb);
      service.ws.subscribe('log', log_cb);
      service.ws.subscribe('urlopen', urlopen_cb);
    }

    service.connect = function(url){

      service.socket = new ReconnectingWebSocket(url)
      var connect = service.connect

      service.ws = new WearScriptConnection(
        service.socket,
        "playground",
        Math.floor(Math.random() * 100000),
        onopen
      );
    }

    return service;

});
