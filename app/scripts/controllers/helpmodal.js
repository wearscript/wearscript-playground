'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('HelpmodalCtrl', function ($scope, $modal, $log) {
    $scope.items = ['Run Script', 'Run Line/Selection', 'Save to Gist'];

    $scope.open = function () {

      var modalInstance = $modal.open({
        templateUrl: 'views/helpmodal.html',
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
