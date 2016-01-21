'use strict';

describe('Controller: StatusModalCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var StatusModalCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StatusModalCtrl = $controller('StatusModalCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
