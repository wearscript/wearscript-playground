'use strict';

angular.module('wearscriptPlaygroundApp')

  .factory('Editor', function(
    $modal,$window,$rootScope,$log,$http,$routeParams,$timeout,$location,Socket,Gist,Profile,Playground, Storage
  ) {

    function gist_cb(channel, gist) {
      var file = $routeParams.file || service.file || 'glass.html';
      service.dirty = false;
      var content = ((gist.files[file] || []).content || '')
      service.editor.getSession().setValue(content);
      Gist.setLocal(service.gistid, file, content)
      service.status = "Loaded: #" + service.gistid+ "/" + service.file
    }
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
            var file = $routeParams.file || service.file || 'glass.html';
            service.gistid = $routeParams.gistid;
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

            service.status = "Loaded: #" + service.gistid + "/" + service.file
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
            Gist.setLocal(
              service.gistid,
              service.file,
              service.editor.session.getValue()
            )

        });
        service.editor.commands.addCommand({
            name: "wake-screen",
            bindKey: {win: "Shift-Enter", mac: "Shift-Enter"},
            exec: function(editor) {
              Socket.ws.publish(
                'glass',
                'lambda',
                'WS.wake();WS.activityCreate();'
              )
            }
        });
        service.editor.commands.addCommand({
            name: "evaluate-editor",
            bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
            exec: function(editor) {
              var filesForGlass = {};
              var gist = Gist.getLocal(service.gistid);
              angular.forEach(gist.files, function(file, fileName){
                filesForGlass[fileName] = file.content
              })
              Socket.ws.publish(
                'glass',
                'script',
                filesForGlass
              );
            }
        });
        service.editor.commands.addCommand({
            name: "save-editor",
            bindKey: {win: "Ctrl-S", mac: "Command-S"},
            exec: function(editor) {
              if ($routeParams.gistid && $routeParams.file) {
                var gist = Gist.getLocal($routeParams.gistid);
                if (gist.user.id == Profile.github_user.id){
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
              Socket.ws.publish('glass','lambda',line);
            }
        });

    }

    return service;

  });
