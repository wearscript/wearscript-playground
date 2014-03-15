'use strict';

angular.module('wearscriptPlaygroundApp')

  .factory('Editor', function(
    $window,$rootScope,$log,$http,$routeParams,Socket,Profile
  ) {
      
    ace.config.set(
      "basePath",
      "bower_components/ace-builds/src-min-noconflict"
    ) ;

    var service = {
      dirty: false,
      content: '',
      gistid: undefined,
      file: undefined,
      forkonsave: false,
      session: false
    } 

    service.init = function(editor){

      service.editor = editor;
      service.session = editor.session;

      function gist_cb(channel, gist) {
          service.dirty = false;
          service.editor.getSession().setValue(gist.files[file].content);
      }
      var ws = Socket.ws;

      //service.editor.setReadOnly(false);
      if ( Profile.get("vim_mode") ){
        service.editor.setKeyboardHandler("ace/keyboard/vim");
      }
        // TODO: This section needs to be reworked
        if (  $routeParams.gistid
           && (  $routeParams.gistid != service.gistid
              || $routeParams.file != service.file
              )
           ) {
            // Drops changes in this case
            service.gistid = $routeParams.gistid;
            var file = $routeParams.file || service.file || 'glass.html';
            service.file = file;
            $log.log('GIST:' + service.gistid + ' File: ' + file);
            var channel = ws.channel(ws.groupDevice, 'gistGet');
            ws.publish_retry(
                gist_cb.bind(this),
                1000,
                channel,
                'gist',
                'get',
                channel,
                service.gistid
            );
        } else {
            if (service.content) {
                // If it's a gist reset the route properly
                service.session.setValue(service.content);
                if (service.gistid && service.file) {
                    $timeout(function() {
                        $rootScope.$apply(function() {
                            $location.path(
                              "/gist/" + service.gistid + "/" + service.file
                            );
                        });
                    });
                }
            } else {

              if ($window.GLASS_BODY == "{{.GlassBody}}" ){
                $http.get('/example')
                  .then(function(res){
                    service.editor.getSession().setValue(res.data);
                  });
              }
            }
        }
        service.editor.getSession().on('change', function(e) {
            service.content = service.editor.session.getValue();
            service.dirty = true;
        });
        service.editor.commands.addCommand({
            name: "evaluate-editor",
            bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
            exec: function(editor) {
                $log.log('run');
                $window.HACK_runservice.editorScriptOnGlass();
            }
        });
        service.editor.commands.addCommand({
            name: "save-editor",
            bindKey: {win: "Ctrl-S", mac: "Command-S"},
            exec: function(editor) {
                $log.log('save: ' + $routeParams.gistid + ' ' + $routeParams.file);
                if ($routeParams.gistid && $routeParams.file) {
                    gistModify(
                      Socket.ws,
                      $routeParams.gistid,
                      $routeParams.file,
                      service.editor.session.getValue(),
                      function (x, y) {
                        $log.log('Gist saved. Result in HACK_GIST_MODIFY');
                        HACK_GIST_MODIFY=y;
                        service.dirty = false;
                      }
                    );
                } else {
                    // HACK(brandyn): Need to allow user to select secret and
                    // set description with a modal
                    gistCreate(
                      Socket.ws,
                      true,
                      "[wearscript]",
                      'glass.html',
                      service.editor.session.getValue(),
                      function (x, y) {
                        $log.log('Gist saved. Result in HACK_GIST_CREATE');
                        service.dirty = false;
                        HACK_GIST_CREATE=y;
                        if (y && y.id) {
                            $rootScope.$apply(function() {
                                $location.path("/gist/" + y.id);
                            });
                        }
                      }
                    );
                }
            }
        });
        service.editor.commands.addCommand({
            name: "evaluate-region",
            bindKey: {win: "Alt-Enter", mac: "Alt-Enter"},
            exec: function(editor) {
                var line = service.editor.session.getTextRange(
                  service.editor.getSelectionRange()
                );
                if (!line.length) {
                    line = service.editor.session.getLine(
                      service.editor.selection.getCursor().row
                    );
                }
                $window.HACK_runLambdaOnGlass(line);
            }
        });
    
    }

    return service;

  });
