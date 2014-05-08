'use strict';

angular.module('wearscriptPlaygroundApp')

  .factory('Editor', function(
    $modal,$window,$rootScope,$log,$http,$routeParams,$timeout,$location,Socket,Gist,Profile,Playground, Storage
  ) {
    ace.config.set(
      "basePath",
      "bower_components/ace-builds/src-min-noconflict"
    )

    var service = {
      dirty: false,
      content: '',
      gistid: undefined,
      file: undefined,
      forkonsave: false,
      session: false,
      menu: true,
      status: ''
    }
    service.update = function() {
        $log.log('editor service updated');
        if (Gist.activeGist && Gist.activeGist.id == $routeParams.gistid)
            return;
        if (!$routeParams.gistid || !$routeParams.file) {
            $log.log('not updating as gistid/file is undefined in routeParams');
            return;
        }
        if (service.session)
            service.session.setValue('');
        Gist.get($routeParams.gistid, function gist_cb(channel, serverGist) {
            if (typeof serverGist === 'string') {
                service.status = 'Error: Unable to get gist: #' + $routeParams.gistid + '. If the problem persists try to re-auth github (click the gears icon).';
                $rootScope.$apply();
                return;
            }
            Gist.refresh(serverGist);
            var file = $routeParams.file;
            if (!serverGist.files[file])
                serverGist.files[file] = {content: ''};
            var content = serverGist.files[file].content;
            service.session.setValue(content);
            service.status = "Loaded: #" + $routeParams.gistid + "/" + $routeParams.file
            $rootScope.$apply();
        }.bind(this));
    }
    service.saveCreate = function(editor) {
        $modal.open({
            templateUrl: 'views/modals/save-gist.html',
            controller: function($scope,$modalInstance){
                $scope.file = {}
                $scope.ok = function(file){
                    $modalInstance.close(file)
                }
                $scope.cancel = function(){
                    $modalInstance.dismiss()
                }
            }
        }).result.then(function(file){
            $log.log(JSON.stringify(Gist.activeGist.files));
            Gist.create(
                !file.private,
                "[wearscript] " + file.description,
                Gist.activeGist.files,
                function (x, y) {
                    if (typeof y === 'string') {
                        $log.log('Got error from gist create: ' + y);
                        // TODO(brandyn): 1. Check if we can tell that it's not this user's gist, 2. check if the user is authorized
                        service.status = "Error: Unable to create gist.  1.) Are you authorized? or 2.) Is github down?.";
                        $rootScope.$apply();
                        return;
                    }
                    if (y && y.id) {
                        service.status = "Created: #" + y.id;
                        $rootScope.$apply()
                        Gist.refresh( y )
                        $location.path("/gist/" + y.id);
                    }
                }
            );
        });
    }
    service.saveFork = function (editor) {
        var gist = Gist.activeGist;
        Gist.fork(
            $routeParams.gistid,
            function (x, gist) {
                if (gist.id){
                    Gist.modify(
                        gist.id,
                        gist.files,
                        function (x, gist){
                            if (typeof gist === 'string') {
                                $log.log('Got error from fork: ' + gist);
                                // TODO(brandyn): 1. Check if we can tell that it's not this user's gist, 2. check if the user is authorized
                                service.status = "Error: Unable to fork gist.";
                                $rootScope.$apply()
                                return;
                            }
                            service.status = "Forked: #" + gist.id+ "/" + $routeParams.file
                            Gist.refresh( gist );
                            $location.path("/gist/" + gist.id);
                            $rootScope.$apply()
                        }
                    )
                }
            }
        );
    }
    service.saveModify = function (editor) {
        var gist = Gist.activeGist;
        Gist.modify(
            gist.id,
            gist.files,
            function (x, modGist) {
                if (typeof modGist === 'string') {
                    $log.log('Got error from modify: ' + modGist);
                    // TODO(brandyn): 1. Check if we can tell that it's not this user's gist, 2. check if the user is authorized
                    service.status = "Error: Unable to write gist.  If this is someone else's gist use Ctrl+Shift+S to 'save as'.";
                    $rootScope.$apply()
                    return;
                }
                Gist.refresh( modGist );
                service.status = "Saved: #" + $routeParams.gistid+ "/" + $routeParams.file
                $rootScope.$apply();
            }
        );
    }
    service.init = function(editor){
      $log.log('editor service constructed');
      service.editor = editor;
      service.session = editor.session;

      //service.editor.setReadOnly(false);
      if ( Profile.get("vim_mode") ){
        service.editor.setKeyboardHandler("ace/keyboard/vim");
      }

      var gist = Gist.activeGist;
      var content = false
      if (  gist
         && gist.files
         && gist.files[$routeParams.file]
         && gist.files[$routeParams.file].content
      ){
        var content = gist.files[$routeParams.file].content
      }

      if ( !content ) {
        service.update();
      } else {
        service.session.setValue(content)
      }

        service.editor.getSession().on('change', function(e) {
            service.dirty = true;
            if (Gist.activeGist && Gist.activeGist.files[$routeParams.file]) {
                Gist.activeGist.files[$routeParams.file].content = service.editor.getValue();
            }
        }
        );
        service.editor.commands.addCommand({
            name: "wake-screen",
            bindKey: {win: "Shift-Enter", mac: "Shift-Enter"},
            exec: function(editor) {
              // NOTE(brandyn): Legacy
              Socket.ws.publish(
                'glass',
                'lambda',
                'WS.wake();WS.activityCreate();'
              )
              Socket.ws.publish(
                'android',
                'lambda',
                'WS.wake();WS.activityCreate();'
              )
              service.status = "Woke Glass Screen"
              $rootScope.$apply()
            }
        });
        service.editor.commands.addCommand({
            name: "evaluate-editor",
            bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
            exec: function(editor) {
              var filesForGlass = {};
                var gist = Gist.activeGist;
                // BUG: Sends old data
                angular.forEach(gist.files, function(file, fileName){
                  filesForGlass[fileName] = file.content
                })
              Socket.ws.publish(
                'glass',
                'script',
                filesForGlass
              );
              Socket.ws.publish(
                'android',
                'script',
                filesForGlass
              );
              service.status = "Sent project to Glass"
              $rootScope.$apply()
            }
        });
        service.editor.commands.addCommand({
            name: "save-editor",
            bindKey: {win: "Ctrl-S", mac: "Command-S"},
            sender: 'editor|cli',
            exec: function(editor) {
                $log.log(JSON.stringify($routeParams));
                var gist = Gist.activeGist;
                $log.log(JSON.stringify(gist));
                $log.log(JSON.stringify(Profile));
                if (true || gist.user && gist.owner.id == Profile.github_user.id){
                    service.saveModify(editor);
                } else {
                    service.saveCreate(editor);
                }

            }
        });

        service.editor.commands.addCommand({
            name: "saveas-editor",
            bindKey: {win: "Ctrl-Shift-S", mac: "Command-Shift-S"},
            exec: service.saveCreate
            });

        service.editor.commands.addCommand({
            name: "evaluate-region",
            bindKey: {win: "Alt-Enter", mac: "Alt-Enter"},
            exec: function(editor) {
              var line = service.editor.session.getTextRange(service.editor.getSelectionRange());
              if (!line.length) {
                line = service.editor.session.getLine(service.editor.selection.getCursor().row);
              }
              // NOTE(brandyn): Legacy
              Socket.ws.publish('glass','lambda',line)
              Socket.ws.publish('android','lambda',line)
              service.status = "Executed Current Line"
              $rootScope.$apply()
            }
        });

    }

    return service;

  });
