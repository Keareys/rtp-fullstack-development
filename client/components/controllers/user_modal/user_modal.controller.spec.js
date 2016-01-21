'use strict';

describe('Controller: UserModalCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var UserModalCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserModalCtrl = $controller('UserModalCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
