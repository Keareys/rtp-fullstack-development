'use strict';

describe('Controller: PerformanceCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var PerformanceCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PerformanceCtrl = $controller('PerformanceCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
