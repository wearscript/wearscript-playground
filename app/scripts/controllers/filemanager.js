'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('FileManagerCtrl', function ($scope, Gist, $modalInstance, $routeParams, $location, Playground, Socket, Editor) {
    var ws = Socket.ws;
    var gists = Gist.gists
    var currentFile = $routeParams.file || '';
    $scope.availableFiles = [];
    $scope.gistName = '';
    $scope.newFileName = '';
    $scope.fileSelected = '';
    for(var idx in gists){
      if(gists[idx].id === $routeParams.gistid){
        $scope.availableFiles = gists[idx].files
      }
    }

    $scope.openFile = function($event){
      $scope.fileSelected = openFileForm.fileSelected.value;
      if(typeof $event != "undefined")
        $event.preventDefault()
      if(typeof $scope.fileSelected == "undefined" || $scope.fileSelected == ''){
        openFileForm.fileSelected.$error = true;
      } else {
        $location.path('/gist/' + $routeParams.gistid + '/' + $scope.fileSelected);
        $scope.ok();
      }
    }

    $scope.newFile = function($event){
      $scope.newFileName = newFileForm.newFileName.value;
      Editor.status = "Created new file:" + $scope.newFileName
      $scope.ok()
      if(typeof $event != "undefined")
        $event.preventDefault()
      $location.path('/gist/' + $routeParams.gistid + '/' + $scope.newFileName)
    }

    $scope.newGist = function(){

    }

    $scope.ok = function(){
      $modalInstance.dismiss('cancel');
    }
  });
