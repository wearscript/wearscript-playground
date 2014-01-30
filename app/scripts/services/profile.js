
'use strict';

angular.module('wearscriptPlaygroundApp')

  .factory( 'Profile', function($rootScope,$log,Socket){

    var profile = {
      authenticated: false,
      complete: false,
      github_user: false,
      google_user: false,
      glass_id: false,
      redirectAuthGoogle: function() {
        window.location.replace('auth');
      },

      redirectAuthGithub: function() {
        window.location.replace('authgh');
      },

      redirectSignout: function() {
        window.location.replace("signout");
      },

      createKey: function(type, success, error) {
        var xhr = $.ajax({url: 'user/key/' + type, type: 'POST', success: success});
        if (!_.isUndefined(error)) {
          xhr.error(error);
        }
      },

      createQR: function(success, error) {
        service.createKey("ws", function (secret) {
          success("https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=" + Socket.url + secret + "&chld=H|4&choe=UTF-8")
        }, error);
      },


    }

    return profile

  })
