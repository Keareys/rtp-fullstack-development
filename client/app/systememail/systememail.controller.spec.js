'use strict';

describe('Controller: SystememailCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var SystememailCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SystememailCtrl = $controller('SystememailCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
