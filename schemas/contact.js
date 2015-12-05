var mongoose = require('mongoose');

var contactSchema = new mongoose.Schema ({   //this is setting up the schema of the object and the "keys" involved
    facebook: {type: String, unique: true},     //url of pictures of listing
    twitter: String,
    skype: String
});

var contact = mongoose.model('contact', contactSchema);  //set var "Sites" mongoose.model method that create model from the schema above titled "Lists"

module.exports = contact;