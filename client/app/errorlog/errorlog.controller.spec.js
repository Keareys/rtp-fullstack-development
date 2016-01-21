'use strict';

describe('Controller: ErrorlogCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var ErrorlogCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ErrorlogCtrl = $controller('ErrorlogCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
