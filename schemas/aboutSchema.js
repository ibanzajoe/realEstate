var mongoose = require('mongoose');

var boutSchema = new mongoose.Schema ({   //this is setting up the schema of the object and the "keys" involved
    name: {type: String, unique: true},
    title: String,                         //title of listing
    phone: String,                    //description of listing
    fax: String,                      //photos of listing in
    email: String,
    pURL: String,
    address: String
});

var bout = mongoose.model('bout', boutSchema);  //set var "Sites" mongoose.model method that create model from the schema above titled "Lists"

module.exports = bout;