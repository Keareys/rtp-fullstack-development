'use strict';

describe('Service: performance', function () {

  // load the service's module
  beforeEach(module('testApp'));

  // instantiate service
  var performance;
  beforeEach(inject(function (_performance_) {
    performance = _performance_;
  }));

  it('should do something', function () {
    expect(!!performance).toBe(true);
  });

});
