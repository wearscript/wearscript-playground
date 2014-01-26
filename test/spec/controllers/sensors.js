'use strict';

describe('Controller: SensorsCtrl', function () {

  // load the controller's module
  beforeEach(module('wearscriptPlaygroundApp'));

  var SensorsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SensorsCtrl = $controller('SensorsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
