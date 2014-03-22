'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('FileManagerCtrl', function ($scope, Gist, $modalInstance, $routeParams, $location, Playground, Socket, Editor, Storage) {
    var ws = Socket.ws;
    var gists = Gist.gists
    var currentFile = $routeParams.file || '';
    $scope.availableFiles = [];
    $scope.gistName = '';
    $scope.newFileName = '';
    $scope.fileSelected = '';
    var gistIndex = 0;

    for(var idx in gists){
      if(gists[idx].id === $routeParams.gistid){
        $scope.availableFiles = gists[idx].files
        gistIndex = idx
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
      if(typeof $event != "undefined")
        $event.preventDefault()
      var file = {};
      file.filename = $scope.newFileName;
      file.content = '';
      var curGist = Gist.gists[gistIndex]
      curGist.files[$scope.newFileName] = file
      Gist.gists[gistIndex] = curGist;
      $modalInstance.dismiss('cancel')
      $location.path('/gist/' + $routeParams.gistid + '/' + $scope.newFileName)
    }

    $scope.newGist = function(){

    }

    $scope.ok = function(){
      $modalInstance.dismiss('cancel');
    }
  });
