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

      function gist_list_cb(channel, gists) {
        if (typeof gists == 'object') {
          for (var i = 0; i < gists.length; i++) {
            gists[i].url_playground = '#/gist/' + gists[i].id;
          }
          Gist.gists = gists;
          Storage.set('gists',gists)
          if(gists[0] && gists[0].user){
            Profile.set("github_user", gists[0].user)
          }
        }
      }

      function gist_cb(channel, gist) {
          service.dirty = false;
          service.editor.getSession().setValue(gist.files[file].content);
          service.gist = gist;
          service.status = "Loaded: #" + service.gist.id+ "/" + service.file
      }

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
            $rootScope.title = service.gistid + "/" + service.file + " | " + $rootScope.title
            Socket.ws.publish_retry(
              gist_cb.bind(this),
              1000,
              Socket.ws.channel(Socket.ws.groupDevice, 'gistGet'),
              'gist',
              'get',
              Socket.ws.channel(Socket.ws.groupDevice, 'gistGet'),
              service.gistid
            );

            Socket.ws.publish_retry(
              gist_list_cb.bind(this),
              1000,
              Socket.ws.channel(Socket.ws.groupDevice, 'gistList'),
              'gist',
              'list',
              Socket.ws.channel(Socket.ws.groupDevice, 'gistList')
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
                $http.get('example')
                  .then(function(res){
                    service.editor.getSession().setValue(res.data);
                  });
              } else {
                service.editor.getSession().setValue(GLASS_BODY);
              }
              service.status = "Loaded: Example"
              $rootScope.title = "Example | " + $rootScope.title
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
              Playground.runScriptOnGlass(Socket.ws, service.editor.session.getValue());
            }
        });
        service.editor.commands.addCommand({
            name: "save-editor",
            bindKey: {win: "Ctrl-S", mac: "Command-S"},
            exec: function(editor) {
              if ($routeParams.gistid && $routeParams.file) {
                if (service.gist.user.id == Profile.github_user.id){
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
                      Gist.refresh( gist );
                      service.gist = gist;
                      service.status = "Forked: #" + gist.id+ "/" + service.file
                      $location.path("/gist/" + gist.id);
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
              Playground.runLambdaOnGlass(Socket.ws, line);
            }
        });

    }

    return service;

  });
