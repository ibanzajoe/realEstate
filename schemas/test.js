var mongoose = require('mongoose');

var testSchema = new mongoose.Schema ({   //this is setting up the schema of the object and the "keys" involved
    primary_photo: String,
    //title of listing
    test: String,
    //photos of listing in
    name: String
});

var test = mongoose.model('test', testSchema);  //set var "Sites" mongoose.model method that create model from the schema above titled "Lists"

module.exports = test;