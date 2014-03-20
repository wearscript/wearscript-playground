'use strict';

describe('Service: Gist', function () {

  // load the service's module
  beforeEach(module('wearscriptPlaygroundApp'));

  // instantiate service
  var Gist;
  beforeEach(inject(function (_Gist_) {
    Gist = _Gist_;
  }));

  it('should do something', function () {
    expect(!!Gist).toBe(true);
  });

});
