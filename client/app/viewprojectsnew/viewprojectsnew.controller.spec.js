'use strict';

describe('Controller: ViewprojectsnewCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var ViewprojectsnewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewprojectsnewCtrl = $controller('ViewprojectsnewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
