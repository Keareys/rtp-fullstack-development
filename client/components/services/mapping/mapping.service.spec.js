'use strict';

describe('Service: mapping', function () {

  // load the service's module
  beforeEach(module('testApp'));

  // instantiate service
  var mapping;
  beforeEach(inject(function (_mapping_) {
    mapping = _mapping_;
  }));

  it('should do something', function () {
    expect(!!mapping).toBe(true);
  });

});
