var mongoose = require('mongoose');

var listSchema = new mongoose.Schema ({   //this is setting up the schema of the object and the "keys" involved
    url: {type: String, unique: true},     //url of pictures of listing
    title: String,                         //title of listing
    description: String,                    //description of listing
    photo: String,                         //photos of listing in
    price: String
});

var lists = mongoose.model('Lists', listSchema);  //set var "Sites" mongoose.model method that create model from the schema above titled "Lists"

module.exports = lists;