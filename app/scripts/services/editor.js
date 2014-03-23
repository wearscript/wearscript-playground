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
      gist: undefined,
      file: undefined,
      forkonsave: false,
      session: false,
      menu: true,
      status: false
    }

    service.init = function(editor){

      service.editor = editor;
      service.session = editor.session;
      service.gistid = $routeParams.gistid || 'example';
      service.file = $routeParams.file || 'glass.html';

      //service.editor.setReadOnly(false);
      if ( Profile.get("vim_mode") ){
        service.editor.setKeyboardHandler("ace/keyboard/vim");
      }

      var gist = Gist.getLocal(service.gistid)
      var content = false
      if (  gist
         && gist.files
         && gist.files[service.file]
         && gist.files[service.file].content
      ){
        var content = gist.files[service.file].content
      }

      if (!content && service.gistid == 'example'){
        if ($window.GLASS_BODY == "{{.GlassBody}}" ){
          $http.get('example')
            .then(function(res){
              Gist.setLocal('example','glass.html',res.data)
              Gist.setLocal('example','manifest.json','{"name":null}')
              service.session.setValue(res.data)
            });
        } else {
          Gist.setLocal('example','glass.html',$window.GLASS_BODY)
          Gist.setLocal('example','manifest.json','{"name":null}')
          service.session.setValue(gist.files[service.file].content)
        }
      } else if ( !content ) {
        Socket.ws.publish_retry(
          function gist_cb(channel, serverGist) {
            var file = $routeParams.file || service.file || 'glass.html';
            var content = ((serverGist.files[file] || []).content || '')
            service.session.setValue(content);
            Gist.refresh(serverGist)
            service.status = "Loaded: #" + service.gistid+ "/" + service.file
          }.bind(this),
          1000,
          Socket.ws.channel(Socket.ws.groupDevice, 'gistGet'),
          'gist',
          'get',
          Socket.ws.channel(Socket.ws.groupDevice, 'gistGet'),
          service.gistid
        );
      } else {
        service.session.setValue(content)
      }

        service.editor.getSession().on('change', function(e) {
            if (service.gistid && service.file){
              service.dirty = true;
              Gist.setLocal(
                service.gistid,
                service.file,
                service.editor.session.getValue()
              )
            }
        }
        );
        service.editor.commands.addCommand({
            name: "wake-screen",
            bindKey: {win: "Shift-Enter", mac: "Shift-Enter"},
            exec: function(editor) {
              Socket.ws.publish(
                'glass',
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
              if (service.gistid){
                var gist = Gist.getLocal(service.gistid);
                angular.forEach(gist.files, function(file, fileName){
                  filesForGlass[fileName] = file.content
                })
              } else {
                filesForGlass = { 
                  'glass.html': service.editor.session.getValue()
                }
              }
              Socket.ws.publish(
                'glass',
                'lambda',
                'WS.wake();WS.activityCreate();'
              )
              Socket.ws.publish(
                'glass',
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
            exec: function(editor) {
              if ( $routeParams.gistid
                 && $routeParams.gistid != 'example'
                 && $routeParams.file
                 )
              {
                var gist = Gist.getLocal($routeParams.gistid);
                if (gist.user && gist.user.id == Profile.github_user.id){
                  Gist.modify(
                    $routeParams.gistid,
                    $routeParams.file,
                    service.editor.session.getValue(),
                    function (x, modGist) {
                      Gist.refresh( modGist );
                      service.status = "Saved: #" + service.gistid+ "/" + service.file
                    }
                  );
                } else {
                  Gist.fork(
                    $routeParams.gistid,
                    function (x, gist) {
                      if (gist.id){
                        Gist.modify(
                          gist.id,
                          $routeParams.file,
                          service.editor.session.getValue(),
                          function (x, gist){
                            service.status = "Forked: #" + gist.id+ "/" + service.file
                            Gist.refresh( gist );
                            $location.path("/gist/" + gist.id);
                            $rootScope.$apply()
                          }
                        )
                      }
                    }
                  );
                }

              } else {

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
                  Gist.create(
                    !file.private,
                    "[wearscript] " + file.description,
                    "glass.html",
                    service.editor.session.getValue(),
                    function (x, y) {
                      if (y && y.id) {
                        Gist.refresh( y )
                        $location.path("/gist/" + y.id);
                      }
                    }
                  );
                })

              }
            }
        });
        service.editor.commands.addCommand({
            name: "evaluate-region",
            bindKey: {win: "Alt-Enter", mac: "Alt-Enter"},
            exec: function(editor) {
              var line = service.editor.session.getTextRange(service.editor.getSelectionRange());
              if (!line.length) {
                line = service.editor.session.getLine(service.editor.selection.getCursor().row);
              }
              Socket.ws.publish('glass','lambda',line)
              service.status = "Executed Current Line"
              $rootScope.$apply()
            }
        });

    }

    return service;

  });
