//Examples used in the Readme.md

var dream = require('./dream');

var helloworld = dream.output();
console.log(helloworld);

dream.output(function(err, result){
    console.log(result);
});

var data = dream
    .schema({
        name: String
    })
    .output();

console.log(data);

dream.schema('User',{
    name: String,
    age: Number
});

dream.schema('Location',{
    address: String,
    postcode: Number
});

dream
    .useSchema('Location')
    .output(function(err, result){
        console.log(result);
    });

dream.schema('User',{
    name: String
});

var data1 = dream
    .useSchema('User')
    .generate(3)
    .output();

var data2 = dream
    .useSchema('User')
    .generateRnd(3)
    .output();

console.log(data1);
console.log(data2);

dream.customType('pi', function(){
    return Math.PI;
});

dream.customType('hello', /hello+ (world|to you)/);

dream
    .schema({
        name: 'name',
        age: 'age',
        address: 'address',
        contact: {
            phone: 'phone',
            servicePhone: /^(800[1-9]{6})$/
        },
        foo: function(){
            return 'bar';
        },
        pi: 'pi',
        hello: 'hello'
    })
    .generateRnd(2)
    .output(function(err, result){
        console.log(result);
    });

dream.customType('FiveWordsSentence', function(helper){
    return helper.chance.sentence({words:5});
});

dream
    .schema({
        frase: 'FiveWordsSentence'
    })
    .generateRnd(2)
    .output(function(err, result){
        console.log(result);
    });


dream.customType('customTypeWithInput', function(helper){
    return helper.input.value;
});

dream
    .input({value: 'Provided by an input'})
    .schema({
        result: 'customTypeWithInput'
    })
    .generateRnd()
    .output(function(err, result){
        console.log(result);
    });

dream.customType('icecreamTruckDay', function (helper) {
    var businessDays = ['Monday', 'Wednesday', 'Friday'];
    return helper.oneOf(businessDays);
});

dream
    .schema({
        icecreamDay: 'icecreamTruckDay'
    })
    .generateRnd(2)
    .output(function(err, result){
        console.log(result);
    });
