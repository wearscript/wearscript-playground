'use strict';

angular.module('wearscriptPlaygroundApp')

  .factory( 'Socket', function($rootScope,$log){

    var connect = function(url){

      // Get reference to port.
      var port = (location.port != 80) ? ':' + location.port : '';

      // Temporarily until configuration is implemented
      //socket = new WebSocket('ws://' + document.domain + '' + port + '/api');
      //var socket = new WebSocket('ws://wearscript.udderweb.com/ws/client');
      var socket = new WebSocket(url);

      socket.onopen = function(){
          var args = arguments;
          service.open = true;
          $log.log('Socket ** Connected')
          if( service.handlers.onopen ){
              $rootScope.$apply(function(){
                service.handlers.onopen.apply( socket, args )
              })
          }
      }

      socket.onmessage = function( data ){
          var args = arguments;

          var reader = new FileReader();
          reader.addEventListener("loadend",function(){
            args[0] = msgpack.unpack(reader.result)
            $log.log('Socket >>',args[0])

            if( service.handlers.onmessage ){
              $rootScope.$apply(function(){
                service.handlers.onmessage.apply(socket, args);
              })
            }
          })
          reader.readAsBinaryString(event.data)
      }

      socket.onclose = function(){
          service.open = false;
          setTimeout( function(){ socket = connect(url); } , 3000 );
          var args = arguments;
          $log.log('Socket !! Disconnected')

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
      encode: function( data ){
        var data_enc = msgpack.pack(data);
        var data_out = new Uint8Array(data_enc.length);
        var i;
        for (i = 0; i < data_enc.length; i++) {
            data_out[i] = data_enc[i];
        }
        return data_out;
      },
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
        $log.log('Socket <<',data)
        var status = socket.send(service.encode(data));
      },
      connect: connect,
      open: false
    };

    return service;

});
