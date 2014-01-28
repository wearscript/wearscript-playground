'use strict';

angular.module('wearscriptPlaygroundApp')

  .factory( 'Socket', function($rootScope,$log){

    var createSocket = function(){

      // Get reference to port.
      var port = (location.port != 80) ? ':' + location.port : '';

      socket = new WebSocket('//' + document.domain + '' + port + '/api');

      socket.onopen = function(){
          var args = arguments;
          service.open = true;

          $rootScope.$broadcast( 'SOCKET_CLOSED' );

          if( service.handlers.onopen ){
              $rootScope.$apply(function(){
                service.handlers.onopen.apply( socket, args )
              })
          }
      }

      socket.onmessage = function( data ){
          var args = arguments;
          try {
            args[0].data = JSON.parse(args[0].data);
          } catch(e){
            // there should be a better way to do this,,, but it is fast
          }

          if( service.handlers.onmessage ){
              $rootScope.$apply(
                  function(){
                      service.handlers.onmessage.apply(socket, args);
                  }
              )
          }
      }

      socket.onclose = function(){
          service.open = false;
          setTimeout( function(){ socket = createSocket(service); } , 3000 );
          var args = arguments;
          $rootScope.$broadcast( 'SOCKET_OPEN' );

          if( service.handlers.onclose ){
              $rootScope.$apply(
                  function(){
                      service.handlers.onclose.apply(socket,args);
                  }
              )
          }
      }

      return socket;
    }

    var service = {
      handlers : {},
      onopen: function( callback ){
        this.handlers.onopen = callback;
      },
      onmessage: function( callback ){
        this.handlers.onmessage = callback;
      },
      onclose: function( callback ){
        this.handlers.onclose = callback;
      },
      send: function( data ){
        var msg = typeof(data) == "object" ? JSON.stringify(data) : data;
        var status = socket.send(msg);
      },
      open: false
    };

    var socket = createSocket();

    return service;

});
