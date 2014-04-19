'use strict';
angular.module('wearscriptPlaygroundApp')
  .controller('MainCtrl', function ($scope,Editor,$routeParams,$location,$timeout) {
      if (!$routeParams.gistid) {
          $timeout(function() {
              if (Editor.gistid)
                  $scope.$apply($location.path('/gist/' + Editor.gistid + '/' + Editor.file));
              else
                  $scope.$apply($location.path('/gist/11069552/glass.html'));
          });
          return;
      }
      if (!$routeParams.file) {
          $timeout(function() {
              if (Editor.file)
                  $scope.$apply($location.path('/gist/' + $routeParams.gistid + '/' + Editor.file));
              else
                  $scope.$apply($location.path('/gist/' + $routeParams.gistid + '/glass.html'));
          });
          return;
      }
      Editor.gistid = $routeParams.gistid;
      Editor.file = $routeParams.file;
      $scope.editor = Editor;
      $scope.editorActive = Editor.active; 
      Editor.update();
  });
