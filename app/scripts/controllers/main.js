'use strict';
angular.module('wearscriptPlaygroundApp')
  .controller('MainCtrl', function ($scope, $window, $location, $http, $routeParams, $timeout, Socket, Playground, Profile) {
    $scope.file = $routeParams.file || '';
    $scope.aceLoaded = function(_editor) {
      function gist_cb(channel, gist) {
        _editor.getSession().setValue(gist.files[$scope.file].content);
      }
      function gist_modify_cb(channel, gists) {
        Profile.set('gists', gists);
      }
      function gist_get_cb(channel, gist) {
        Profile.set('gists', gist);
      }
      var ws = Socket.ws;
      if ( Profile.get("vim_mode") ){
        _editor.setKeyboardHandler("ace/keyboard/vim");
      }
        if( $routeParams.gistid || $routeParams.file){
          $scope.file = $routeParams.file;
          var channel = ws.channel(ws.groupDevice, 'gistGet');
          ws.publish_retry(gist_cb.bind(this), 1000, channel, 'gist', 'get', channel, $routeParams.gistid)
        } else {
          if ($window.HACK_CONTENT) {
            // If it's a gist reset the route properly
            _editor.getSession().setValue($window.HACK_CONTENT);
            if ($window.HACK_GISTID && $window.HACK_FILE) {
              $timeout(function() {
                $rootScope.$apply(function() {
                  $location.path("/gist/" + $window.HACK_GISTID + "/" + $window.HACK_FILE);
                });
              });
            }
          } else {
              _editor.getSession().setValue(GLASS_BODY);
          }
        }
        _editor.getSession().on('change', function(e) {
          // I don't know why this is necessary
        });
        _editor.commands.addCommand({
          name: "evaluate-editor",
          bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
          exec: function(editor) {
              Playground.runScriptOnGlass(ws, _editor.session.getValue());
          }
        });
        _editor.commands.addCommand({
          name: "save-editor",
          bindKey: {win: "Ctrl-S", mac: "Command-S"},
          exec: function(editor) {
            console.log('save: ' + $routeParams.gistid + ' ' + $routeParams.file);
            if ($routeParams.gistid && $routeParams.file) {
              Playground.gistModify(ws, $routeParams.gistid, $routeParams.file, _editor.session.getValue(), function (x, modGist) {
                Playground.updateLocalGists( modGist );
              });
            } else {
              // @TODO: Need to allow user to select secret and set description with a modal
              Playground.gistCreate(ws, true, "[wearscript]", 'glass.html', _editor.session.getValue(), function (x, y) {
                if (y && y.id) {
                  Playground.updateLocalGists( y )
                  $location.path("/gist/" + y.id);
                }
              });
            }
          }
        });
        _editor.commands.addCommand({
          name: "evaluate-region",
          bindKey: {win: "Alt-Enter", mac: "Alt-Enter"},
          exec: function(editor) {
            var line = _editor.session.getTextRange(_editor.getSelectionRange());
            if (!line.length) {
              line = _editor.session.getLine(_editor.selection.getCursor().row);
            }
            Playground.runLambdaOnGlass(ws, line);
          }
        });
    };
    $scope.aceChanged = function(e) {
      /*
      var e_el = document.getElementsByClassName('.ace_editor')[0];
      //var doc = e.getSession().getDocument();
      e_el.style.height = 16 * doc.getLength() + 'px';
      e.resize();
      */
    };
  });
