'use strict';

angular.module('wearscriptPlaygroundApp')

  .factory( 'Socket', function($log,$window, Profile, $rootScope, Logging){
    
    var service = {
      ws: {},
      deviceCount: 0,
      connected: false,
      devices: [{name:"myo", connected:false}, {name:"glass", connected:false}, {name:"pebble", connected:false}, {name:"phone", connected:false}],
    }

    function onopen(){

      $log.info('** Socket','Server Connected');
      $rootScope.$broadcast('connected')
      service.connected=true;
      function log_cb(channel, message) {
        Logging.ws = Logging.ws || [];
        if(Logging.ws.length > 1000){
          Logging.ws.pop()
        }
        if(channel.indexOf('log') != -1){
          var log = {}
          log.type = 'log'
          log.message = message
          Logging.ws.unshift(log);
        }
        $log.info(channel + " : " + message);

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
          angular.forEach(service.devices, function(k){
            if(k.name == "glass") k.connected = true;
          })
          $rootScope.$apply();
        } else {
          $log.warn('!! Socket','Glass Disconnected');
          angular.forEach(service.devices, function(k){
            if(k.name == "glass") k.connected = false;
            
          })
        }
        service.counter();
      }

      service.ws.subscribeTestHandler();
      service.ws.subscribe('subscriptions', subscription_cb);
      service.ws.subscribe('log', log_cb);
      service.ws.subscribe('urlopen', urlopen_cb);
    }

    service.connect = function(url, callback){

      service.socket = new ReconnectingWebSocket(url)
      service.socket.onclose = function(){
        service.connected = false;
        
        $log.error('!! Socket','Server Disconnected');
      }

      var connect = service.connect

      service.ws = new WearScriptConnection(
        service.socket,
        "playground",
        Math.floor(Math.random() * 100000),
        function(){
          onopen()
          callback()
        }
      );
    }

    service.counter = function(){
      service.deviceCount = 0;
       angular.forEach(service.devices, function(k){
            if(k.connected == true) service.deviceCount++;
          })
    }

    return service;

});
