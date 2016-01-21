'use strict';

describe('Controller: ProjectlistCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var ProjectlistCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectlistCtrl = $controller('ProjectlistCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
