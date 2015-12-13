var chai = require('chai');
var expect = require('chai').expect;
var Dream = require('../dream.js');

describe('Dream', function () {
  describe('default output', function () {
    it('should display Hello World output', function () {
      expect(Dream.output()).to.deep.equal({Dream: 'Hello World'});
    });

    it("should display Hello World output in callback", function (done) {
      // if it becomes async in the future
      Dream.output(function(err, result){
        expect(result).to.deep.equal({Dream: 'Hello World'});
        done();
      })
    });
  });
});
