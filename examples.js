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
