'use strict';

angular.module('wearscriptPlaygroundApp')

  .factory( 'Socket', function($log,$window, Profile, $rootScope){

    var service = {}

    function onopen(){

      $log.info('** Socket','Server Connected');
      $rootScope.$broadcast('connected')
      function log_cb(channel, message) {
        if(channel.indexOf('log') != -1){
          $log.log(channel + ': ' + message);
        } else {
          $log.info(channel + " : " + message);
        }

        // TODO(brandyn): Have a notification that a log message was sent
      }

      function urlopen_cb(channel, url) {
        $window.open(url);
      }
      function subscription_cb(foo){
        $rootScope.$broadcast('subscription')
        if (service.ws.exists('glass')){
            $log.info('** Socket','Glass Connected');
            $rootScope.$broadcast('glass')
        } else {
            $log.warn('!! Socket','Glass Disconnected');
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
