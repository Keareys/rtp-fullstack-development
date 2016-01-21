'use strict';

describe('Service: sessions', function () {

  // load the service's module
  beforeEach(module('testApp'));

  // instantiate service
  var sessions;
  beforeEach(inject(function (_sessions_) {
    sessions = _sessions_;
  }));

  it('should do something', function () {
    expect(!!sessions).toBe(true);
  });

});
