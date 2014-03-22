'use strict';
angular.module('wearscriptPlaygroundApp')
  .controller('MainCtrl', function ($scope, Editor) {
  	  $scope.editor = Editor;
    $scope.editorActive = Editor.active; 
  });
