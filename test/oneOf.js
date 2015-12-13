var chai = require('chai');
var expect = require('chai').expect;
var dream = require('../dream.js');

dream.customType('oneOfTestArray', function (helper) {
  var businessDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return helper.oneOf(businessDays);
});

dream.customType('oneOfTestString', function (helper) {
  return helper.oneOf("hello")
});

dream.schema('OneOfSchema', {
  array: 'oneOfTestArray',
  string: 'oneOfTestString'
});

describe('Dream', function () {
  describe('oneOf', function () {
    var result = dream
      .useSchema('OneOfSchema')
      .generateRnd()
      .output();

    it('should use input data within a custom type', function () {
      expect(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).to.include(result.array);
    });

    it('should use input string within a custom type', function () {
      expect("hello").to.include(result.string);
    })
  });
});
