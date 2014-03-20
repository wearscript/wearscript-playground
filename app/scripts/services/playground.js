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
    return service
})
