'use strict';

describe('Controller: EditorcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('wearscriptPlaygroundApp'));

  var EditorcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorcontrollerCtrl = $controller('EditorcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
