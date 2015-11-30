var dream = require('./dream');

dream.customType('pi', function(){
    return Math.PI;
});

dream.customType('hello', /hello+ (world|to you)/);

var userSchema = {
    name: 'name',
    age: 'age',
    country: 'country',
    ipAddress: 'ip',
    address: 'address',
    contact: {
        phone: 'phone',
        servicePhone: /^(800[1-9]{6})$/,
    },
    foo: function () {
        return 'bar';
    }
}

var locationSchema = {
    address: 'address',
    areacode: 'areacode',
    city: 'city',
    country: 'country',
    state: 'state',
    postal: 'postal',
    pi: 'pi',
    hello: 'hello'
}

dream.schema('User', userSchema);
dream.schema('Location', locationSchema);

dream
    .useSchema('User')
    .generateRnd(2)
    .output(function (err, result) {
        console.log(result);
    });

dream
    .useSchema('Location')
    .generateRnd(2)
    .output(function (err, result) {
        console.log(result);
    });
    