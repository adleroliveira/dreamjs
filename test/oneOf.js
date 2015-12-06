var chai = require('chai');
var expect = require('chai').expect;
var dream = require('../dream.js');

dream.customType('oneOfTest', function (helper) {
  var businessDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return helper.oneOf(businessDays);
});

dream.schema('OneOfSchema', {result: 'oneOfTest'});

describe('Dream', function () {
  describe('inputs', function () {
    it('should use input data within a custom type', function () {
      expect(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).to.include(dream.useSchema('OneOfSchema').generateRnd().output().result);
    });
  });
});
