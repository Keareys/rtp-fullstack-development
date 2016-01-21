'use strict';

describe('Service: dropdowns', function () {

  // load the service's module
  beforeEach(module('testApp'));

  // instantiate service
  var dropdowns;
  beforeEach(inject(function (_dropdowns_) {
    dropdowns = _dropdowns_;
  }));

  it('should do something', function () {
    expect(!!dropdowns).toBe(true);
  });

});
