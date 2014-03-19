'use strict'
angular.module('wearscriptPlaygroundApp')
  .factory( 'Playground', function($log,$rootScope,$location,Socket, Profile){
    var service = {}
    service.redirectAuthGoogle = function() {
        $location.replace('auth')
    }
    service.redirectAuthGithub = function() {
        $location.replace('authgh')
    }
    service.redirectSignout = function() {
        $location.replace("signout")
    }
    service.createKey = function(type, success, error) {
        var xhr = $.ajax({url: 'user/key/' + type, type: 'POST', success: success})
        if (!_.isUndefined(error)) {
            xhr.error(error)
        }
    }
    service.createQR = function(WSUrl, success, error) {
        service.createKey("ws", function (secret) {success("https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=" + WSUrl + "/ws/" + secret + "&chld=H|4&choe=UTF-8")}, error)
    }
    service.runScriptOnGlass = function(ws, script) {
        ws.publish('glass', 'script', {'glass.html': script})
    }
    service.runLambdaOnGlass = function(ws, script) {
        ws.publish('glass', 'lambda', script)
    }
    service.gistGet = function(ws, gistid, callback) {
        $log.info('<< Playground','gistGet',gistid)
        ws.subscribe(
          ws.channel(ws.groupDevice, 'gistGet'),
          function(){
            $log.info('>> Playground','gistGet',arguments)
            callback.apply(this,arguments)
          }
        )
        ws.publish_retry('gist', 'get', ws.channel(ws.groupDevice, 'gistGet'), gistid)
    }
    service.gistModify = function(ws, gistid, fileName, content, callback) {
        $log.info('<< Playground','gistModify',gistid,fileName,content)
        var c = ws.channel(ws.groupDevice, 'gistModify')
        ws.subscribe(c, callback)
        var files = {}
        files[fileName] = {content: content}
        ws.publish('gist', 'modify', c, gistid, undefined, files)
    }
    service.gistCreate = function(ws, secret, description, fileName, content, callback) {
        $log.info('<< Playground','gistCreate',description,fileName,content)
        var c = ws.channel(ws.groupDevice, 'gistCreate')
        ws.subscribe(c, callback)
        var files = {}
        files['manifest.json'] = { content: '{"name":""}' }
        files[fileName] = { content: content }
        ws.publish('gist', 'create', c, secret, description, files)
    }
    service.gistFork = function(ws, gistid, callback) {
        $log.info('<< Playground','gistFork',gistid)
        ws.subscribe(ws.channel(ws.groupDevice, 'gistFork'), callback)
        ws.publish('gist', 'fork', ws.channel(ws.groupDevice, 'gistFork'), gistid)
    }
    service.updateLocalGists = function(g){
      $log.info('** Playground','updateLocalGists',g)
      var gists = Profile.get('gists')
      var exists = false
      for( var idx in gists ){
        if( gists[idx].id == g.id){
          gists[idx] = g
          exists = true
        }
      }
      if(!exists){
        gists.push(g)
      }
      Profile.set('gists', gists)
    }
    return service
})
