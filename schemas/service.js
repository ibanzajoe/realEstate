var mongoose = require('mongoose');

var serviceSchema = new mongoose.Schema ({   //this is setting up the schema of the object and the "keys" involved
    url: {type: String, unique: true},     //url of pictures of listing
                             //title of listing
    descript: String                    //description of listing
                             //photos of listing in

});

var service = mongoose.model('service', serviceSchema);  //set var "Sites" mongoose.model method that create model from the schema above titled "Lists"

module.exports = service;