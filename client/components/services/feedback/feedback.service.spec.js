'use strict';

describe('Service: feedback', function () {

  // load the service's module
  beforeEach(module('testApp'));

  // instantiate service
  var feedback;
  beforeEach(inject(function (_feedback_) {
    feedback = _feedback_;
  }));

  it('should do something', function () {
    expect(!!feedback).toBe(true);
  });

});
