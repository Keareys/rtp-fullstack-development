'use strict';

describe('Controller: MapprojectsCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var MapprojectsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MapprojectsCtrl = $controller('MapprojectsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
