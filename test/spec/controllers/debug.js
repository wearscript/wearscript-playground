'use strict';

describe('Controller: DebugCtrl', function () {

  // load the controller's module
  beforeEach(module('wearscriptPlaygroundApp'));

  var DebugCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DebugCtrl = $controller('DebugCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
