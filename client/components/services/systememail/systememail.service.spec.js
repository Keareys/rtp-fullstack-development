'use strict';

describe('Service: systememail', function () {

  // load the service's module
  beforeEach(module('testApp'));

  // instantiate service
  var systememail;
  beforeEach(inject(function (_systememail_) {
    systememail = _systememail_;
  }));

  it('should do something', function () {
    expect(!!systememail).toBe(true);
  });

});
