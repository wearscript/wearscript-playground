'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('ModalCtrl', function ($scope, $modal, $log) {
    $scope.shortcuts = [
      {
        description:'Run Script',
        command:'Ctrl+Enter (Cmd+Enter for OSX)'
      }, 
      {
        description:'Run Line/Selection',
        command:'Alt+Enter'
      }, 
      {
        description:'Save to Gist',
        command:'Ctrl+S'
      }
    ];

    $scope.open = function (currentModal) {

      var modalTemplate = '';
      switch(currentModal){
        case undefined:
        case '':
          modalTemplate = 'views/modals/help.html'
          console.log(modalTemplate);
          break;
        case 'help':
          modalTemplate = 'views/modals/help.html'
          break;
        case 'shortcuts':
          modalTemplate = 'views/modals/shortcuts.html'
          break;
        case 'save-gist':
          modalTemplate = 'views/modals/save-gist.html'
          break
      }
      var modalInstance = $modal.open({
        templateUrl: modalTemplate,
        controller: ModalInstanceCtrl,
        resolve: {
          shortcuts: function () {
            return $scope.shortcuts;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  });

var ModalInstanceCtrl = function ($scope, $modalInstance, shortcuts) {
  
    $scope.shortcuts = shortcuts;
    $scope.selected = {
      shortcut: $scope.shortcuts[0]
    };
  
    $scope.ok = function () {
      $modalInstance.close($scope.selected.shotrcut);
    };
  
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
};

/*
///////////////////////
I made the shortcuts work but I wasn't sure how you wanted to
organize this controler so I left all of the old code here.
///////////////////////
'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('ModalCtrl', function ($scope, $modal, $log) {
    $scope.items = ['Run Script', 'Run Line/Selection', 'Save to Gist'];

    $scope.open = function (currentModal) {

      var modalTemplate = '';
      switch(currentModal){
        case undefined:
        case '':
          modalTemplate = 'views/modals/help.html'
          console.log(modalTemplate);
          break;
        case 'help':
          modalTemplate = 'views/modals/help.html'
          break;
        case 'shortcuts':
          modalTemplate = 'views/modals/shortcuts.html'
          break;
        case 'save-gist':
          modalTemplate = 'views/modals/save-gist.html'
          break
      }
      var modalInstance = $modal.open({
        templateUrl: modalTemplate,
        controller: ModalInstanceCtrl,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  });

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
};
*/
