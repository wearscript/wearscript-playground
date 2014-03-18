'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('HeaderCtrl', function ($scope,Editor) {
    $scope.status = Editor.status || "Loaded"
    $scope.editorActive = Editor.active; 
  });
