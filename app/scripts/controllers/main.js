'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('MainCtrl', function ($scope,$location,Profile) {

    $scope.aceLoaded = function(_editor) {
      // Options
      //_editor.setReadOnly(false);
      //_editor.setKeyboardHandler("ace/keyboard/vim");
        _editor.getSession().setValue(GLASS_BODY);
        _editor.commands.addCommand({
            name: "evaluate-editor",
            bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
            exec: function(editor) {
                console.log('run');
                HACK_runEditorScriptOnGlass();
            }
        });
        _editor.commands.addCommand({
            name: "evaluate-region",
            bindKey: {win: "Alt-Enter", mac: "Alt-Enter"},
            exec: function(editor) {
                var line = _editor.session.getTextRange(_editor.getSelectionRange());
                if (!line.length) {
                    line = _editor.session.getLine(_editor.selection.getCursor().row);
                }
                HACK_runLambdaOnGlass(line);
            }
        });

        HACK_EDITOR = _editor;
    };

    $scope.aceChanged = function(e) {
      var e_el = document.getElementsByClassName('.ace_editor')[0];
      //var doc = e.getSession().getDocument();
      e_el.style.height = 16 * doc.getLength() + 'px';
      e.resize();
    };
  });
