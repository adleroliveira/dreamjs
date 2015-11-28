var dream = require('./dream');

// dream.defaultSchema({
//     test: String
// });

// dream.schema('User', {
//     name: String,
//     age: Number
// });

dream.schema('User', {
    name: 'fullname',
    age: 'age',
    gender: 'gender',
    children: {
        name: 'name',
        age: 'age'
    }
});

dream.schema('Blog', {
    title: 'sentence',
    creationDate: Date
});

dream
    .useSchema('Blog')
    .generateRnd(3)
    .output(function (err, result) {
        console.log(result);
    });
    
// Output:
// [ { title: 'Musmeos cise hobva torfe fobra ifi bohap efu jes lasmapjid mu mibda ore.',
//     creationDate: '5/10/2052' },
//   { title: 'Ile ut zu hir eda ewozlac becikoom weta bakcok zizhecul tijomi cas.',
//     creationDate: '6/18/2086' },
//   { title: 'Ce ba susef oc wizjoam izujul sollol zanov at wa vaf fezgop gaciphi.',
//     creationDate: '12/4/2097' } ]
