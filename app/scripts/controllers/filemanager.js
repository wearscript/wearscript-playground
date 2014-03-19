'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('FileManagerCtrl', function ($scope, Profile, $modalInstance, $routeParams, $location, Playground, Socket, Editor) {
    var ws = Socket.ws;
    var gists = Profile.gists
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

    $scope.openFile = function(){
      $scope.fileSelected = openFileForm.fileSelected.value;
      if(typeof $scope.fileSelected == "undefined" || $scope.fileSelected == ''){
        openFileForm.fileSelected.$error = true;
      } else {
        $location.path('/gist/' + $routeParams.gistid + '/' + $scope.fileSelected);
        $scope.ok();
      }
    }

    $scope.newFile = function(){
      $scope.newFileName = newFileForm.newFileName.value;
      Editor.status = "Created new file:" + $scope.newFileName
      $scope.ok()
      $location.path('/gist/' + $routeParams.gistid + '/' + $scope.newFileName)
    }

    $scope.newGist = function(){

    }

    $scope.ok = function(){
      $modalInstance.dismiss('cancel');
    }
  });
