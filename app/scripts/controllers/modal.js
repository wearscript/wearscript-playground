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
