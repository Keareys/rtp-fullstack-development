'use strict';

describe('Controller: UseraccountCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var UseraccountCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UseraccountCtrl = $controller('UseraccountCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
