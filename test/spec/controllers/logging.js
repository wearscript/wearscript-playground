'use strict';

describe('Controller: LoggingCtrl', function () {

  // load the controller's module
  beforeEach(module('wearscriptPlaygroundApp'));

  var LoggingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoggingCtrl = $controller('LoggingCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
