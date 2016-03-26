#!/usr/bin/env node
var dream = require('./dream.js');
var data = require(process.cwd() + '/schema.js');

var schema;
var reps;
var genRand = false;
var output;

process.argv.forEach(function (value, index) {
	if (index == 0 || index == 1) {
		return true;
	}

	// set repetitions
	if ( !isNaN(value) ) {
		reps = value;
		return true;
	}

	// fill output
	if ( value == '-f') {
		genRand = true;
		return true;
	}

	schema = value;
})


if (genRand) {
	output = dream.useSchema(schema).generateRnd(reps).output();
} else {
	output = dream.useSchema(schema).generate(reps).output();
}


console.log(JSON.stringify(output, null, 4));