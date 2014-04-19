'use strict';

angular.module('wearscriptPlaygroundApp')
.factory('Gist', function($log,$http,$window,Storage,Socket, Profile) {

    var service = {
      gists: [],
      activeGist: undefined
    }

    service.list = function(callback){
      var ws = Socket.ws;
      var channel = ws.channel(ws.groupDevice, 'gistList');
      ws.publish_retry(function(channel, gists){
        if(typeof gists == 'object'){
            for (var i = 0; i < gists.length; i++)
                gists[i].url_playground = '#/gist/' + gists[i].id
            Storage.set('gists', gists)
            service.gists = gists;
            Profile.set("github_user", gists[0].owner);
            if(typeof callback == 'function'){
                callback.call(this)
            }
        }
      }.bind(this), 1000, channel, 'gist', 'list', channel);
    }

    service.get = function(id, callback) {
      var channel = Socket.ws.channel(Socket.ws.groupDevice, 'gistGet')
      $log.info('<< Gist','get',id)
      Socket.ws.publish_retry(
        callback,
        1000,
        channel,
        'gist',
        'get',
        channel,
        id
      );
    }

    service.getLocal = function(id){
      for(var idx in service.gists){
          var gist = service.gists[idx]
          if(gist.id == id) return gist
      }
    }

    service.setLocal = function(id, file, content){
      var update = false
      angular.forEach(service.gists, function(gist){
        if(gist.id == id){
          if (!gist.files[file]) gist.files[file] = {}
          gist.files[file].content = content
          update = true
        }
      })
      if (!update){
        var gist = {'id':id,'files':{}}
        gist.files[file] = {'content':content}
        service.gists.push(gist)
      }
    }

    service.modify = function(id, files, callback) {
        $log.info('<< Gist','modify', id, files)
        var channel = Socket.ws.channel(Socket.ws.groupDevice, 'gistModify')
        Socket.ws.subscribe(channel, callback)
        angular.forEach(files, function(file){
          angular.forEach(file, function(value, prop){
            if(prop != "content"){
              delete file[prop];
            }
          })
        })
        Socket.ws.publish('gist','modify',channel,id,undefined,files)
    }

    service.create = function(secret, description, files, callback) {
        $log.info('<< Gist','create',description,files)
        var channel = Socket.ws.channel(Socket.ws.groupDevice, 'gistCreate')
        Socket.ws.subscribe(channel, callback)
        Socket.ws.publish('gist', 'create', channel, secret, description, files)
    }

    service.fork = function(id, callback) {
        $log.info('<< Gist','fork',id)
        var channel = Socket.ws.channel(Socket.ws.groupDevice, 'gistFork')
        Socket.ws.subscribe(channel, callback)
        Socket.ws.publish('gist','fork', channel, id )
    }

    service.refresh = function(gist){
      $log.info('** Gist','refresh',gist)
      service.activeGist = gist;
      $window.HACK_ACTIVE = service.activeGist;
    }

    service.init = function(){
        service.list();
    }


    return service

  });
