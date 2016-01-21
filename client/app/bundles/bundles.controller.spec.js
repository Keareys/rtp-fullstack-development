'use strict';

describe('Controller: BundlesCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var BundlesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BundlesCtrl = $controller('BundlesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
