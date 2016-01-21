'use strict';

describe('Controller: ViewprojectsCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var ViewprojectsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewprojectsCtrl = $controller('ViewprojectsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
