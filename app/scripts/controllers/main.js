'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('MainCtrl', function ($scope,$location,Profile) {

    $scope.aceLoaded = function(_editor) {
      // Options
      //_editor.setReadOnly(false);
      //_editor.setKeyboardHandler("ace/keyboard/vim");
    };

    $scope.aceChanged = function(e) {
      var e_el = document.getElementsByClassName('.ace_editor')[0];
      var doc = e.getSession().getDocument();
      e_el.style.height = 16 * doc.getLength() + 'px';
      e.resize();
    };

    if (!Profile.authenticated){
      $location.path('/profile')
    }
  });
