'use strict';

angular.module('wearscriptPlaygroundApp')
.factory('Gist', function($log,$http,$window,Storage,Socket, Profile) {

    var service = {
      gists: [],
    }

    service.list = function(callback){
      var ws = Socket.ws;
      var channel = ws.channel(ws.groupDevice, 'gistList');
      ws.publish_retry(function(channel, gists){
        if(typeof gists == 'object'){
          if (typeof gists == 'object') {
            for (var i = 0; i < gists.length; i++)
              gists[i].url_playground = '#/gist/' + gists[i].id
            Storage.set('gists', gists)
            service.gists = gists;
            if(typeof callback == 'function'){
              callback.call(this)
            }
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

    service.modify = function(id, fileName, content, callback) {
        $log.info('<< Gist','modify',id,fileName,content)
        var channel = Socket.ws.channel(Socket.ws.groupDevice, 'gistModify')
        var files = {}
        files[fileName] = {content: content}
        Socket.ws.subscribe(channel, callback)
        Socket.ws.publish('gist', 'modify', channel, id, undefined, files)
    }

    service.create = function(secret, description, fileName, content, callback) {
        $log.info('<< Gist','create',description,fileName,content)
        var channel = Socket.ws.channel(Socket.ws.groupDevice, 'gistCreate')
        var files = {}
        files['manifest.json'] = { content: '{"name":""}' }
        files[fileName] = { content: content }
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
      var exists = false;
      for( var idx in service.gists ){
        if( service.gists[idx].id == gist.id){
          service.gists[idx] = gist
          exists = true
        }
      }
      if(!exists){
        service.gists.push(gist)
      }
      Storage.set('gists',service.gists)
    }

    service.init = function(){
      function gist_list_cb(channel, gists) {
        if (typeof gists == 'object') {
          for (var i = 0; i < gists.length; i++) {
            gists[i].url_playground = '#/gist/' + gists[i].id;
          }
          angular.forEach(gists,function(gist){
            service.refresh(gist)
          })
          Storage.set('gists',gists)
          if(gists[1] && gists[1].user){
            Profile.set("github_user", gists[0].user)
          }
        }
      }

      Socket.ws.publish_retry(
        gist_list_cb.bind(this),
        1000,
        Socket.ws.channel(Socket.ws.groupDevice, 'gistList'),
        'gist',
        'list',
        Socket.ws.channel(Socket.ws.groupDevice, 'gistList')
      );

    }


    return service

  });
