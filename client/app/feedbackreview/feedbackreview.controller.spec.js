'use strict';

describe('Controller: FeedbackreviewCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var FeedbackreviewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FeedbackreviewCtrl = $controller('FeedbackreviewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
