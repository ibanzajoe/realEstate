var mongoose = require('mongoose');

var listSchema = new mongoose.Schema ({   //this is setting up the schema of the object and the "keys" involved
    title: String,                         //title of listing
    description: String,                    //description of listing
    primary_photo: {type: String},     //url of pictures of listing
    price: String,
    photos: String                         //photos of listing in
});

var lists = mongoose.model('Lists', listSchema);  //set var "Sites" mongoose.model method that create model from the schema above titled "Lists"

module.exports = lists;