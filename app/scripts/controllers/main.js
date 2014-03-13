'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('MainCtrl', function ($scope,$window,$location,Profile,$routeParams,$rootScope,$timeout) {

    $scope.aceLoaded = function(_editor) {
      function gist_cb(channel, gist) {
          $window.HACK_DIRTY = false;
          _editor.getSession().setValue(gist.files[file].content);
      }
      var ws = $window.HACK_WS;
      // Options
      //_editor.setReadOnly(false);
        if (localStorage.getItem("vim_mode")  === "true"){
          _editor.setKeyboardHandler("ace/keyboard/vim");
        }
        // TODO: This section needs to be reworked
        if ($routeParams.gistid && ($routeParams.gistid != $window.HACK_GISTID || $routeParams.file != $window.HACK_FILE)) {
            // Drops changes in this case
            $window.HACK_GISTID = $routeParams.gistid;
            var file = $routeParams.file || $window.HACK_FILE || 'glass.html';
            $window.HACK_FILE = file;
            console.log('GIST:' + $window.HACK_GISTID + ' File: ' + file);
            var channel = ws.channel(ws.groupDevice, 'gistGet');
            ws.publish_retry(gist_cb.bind(this), 1000, channel, 'gist', 'get', channel, $window.HACK_GISTID);
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
            $window.HACK_CONTENT = _editor.session.getValue();
            $window.HACK_DIRTY = true;
        });
        _editor.commands.addCommand({
            name: "evaluate-editor",
            bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
            exec: function(editor) {
                console.log('run');
                $window.HACK_runEditorScriptOnGlass();
            }
        });
        _editor.commands.addCommand({
            name: "save-editor",
            bindKey: {win: "Ctrl-S", mac: "Command-S"},
            exec: function(editor) {
                console.log('save: ' + $routeParams.gistid + ' ' + $routeParams.file);
                if ($routeParams.gistid && $routeParams.file) {
                    gistModify(HACK_WS, $routeParams.gistid, $routeParams.file, HACK_EDITOR.session.getValue(), function (x, y) {console.log('Gist saved. Result in HACK_GIST_MODIFY');HACK_GIST_MODIFY=y;$window.HACK_DIRTY = false;});
                } else {
                    // HACK(brandyn): Need to allow user to select secret and set description with a modal
                    gistCreate(HACK_WS, true, "[wearscript]", 'glass.html', HACK_EDITOR.session.getValue(), function (x, y) {
                        console.log('Gist saved. Result in HACK_GIST_CREATE');
                        $window.HACK_DIRTY = false;
                        HACK_GIST_CREATE=y;
                        if (y && y.id) {
                            $rootScope.$apply(function() {
                                $location.path("/gist/" + y.id);
                            });
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
                $window.HACK_runLambdaOnGlass(line);
            }
        });

        $window.HACK_EDITOR = _editor;
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
