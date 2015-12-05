var mongoose = require('mongoose');

var testSchema = new mongoose.Schema ({   //this is setting up the schema of the object and the "keys" involved
    url: {type: String, unique: true},     //url of pictures of listing
    //title of listing
    testimony: String,                    //description of listing
    //photos of listing in
    name: String
});

var test = mongoose.model('test', testSchema);  //set var "Sites" mongoose.model method that create model from the schema above titled "Lists"

module.exports = test;