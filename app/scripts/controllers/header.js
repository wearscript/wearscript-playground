'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('HeaderCtrl', function ($scope,Editor) {
    $scope.editor = Editor;
    $scope.editorActive = Editor.active; 
  });
