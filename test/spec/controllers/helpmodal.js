'use strict';

describe('Controller: HelpmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('wearscriptPlaygroundApp'));

  var HelpmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HelpmodalCtrl = $controller('HelpmodalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
