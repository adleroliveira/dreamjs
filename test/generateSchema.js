var chai = require('chai');
var expect = require('chai').expect;
var dream = require('../dream.js');

var objInfo = [
  {
    name: 'John Doe',
    age: 58,
    hobbies: ['swiming', 'hiking', 'gaming']
  }, {
    name: 'John Doe',
    age: 58,
    hobbies: ['swiming', 'hiking', 'gaming']
  }
];

dream.generateSchema('Person', objInfo);

describe('Dream', function () {
  describe('generated schema', function () {
    it('should generate a schema based on a object with values', function () {
      expect(dream.useSchema('Person').generateRnd().output().name).to.be.a('string');
      expect(dream.useSchema('Person').generateRnd().output().age).to.be.a('number');
      expect(dream.useSchema('Person').generateRnd().output().hobbies).to.be.a('array');
    });
  });
});
