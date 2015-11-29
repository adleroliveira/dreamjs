var dream = require('./dream');

dream
    .schema({
        name: 'name',
        age: 'age',
        address: 'address',
        contact: {
            phone: 'phone',
            servicePhone: /^(800[1-9]{6})$/,
        },
        foo: function(){
            return 'bar';
        }
    })
    .generateRnd(2)
    .output(function(err, result){      
        console.log(result);        
    });