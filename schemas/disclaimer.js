var mongoose = require('mongoose');

var discSchema = new mongoose.Schema ({   //this is setting up the schema of the object and the "keys" involved
    disclaimer: {type: String, unique: true},     //url of pictures of listing
    unsubscribe: String,
    copyright: String
});

var disc = mongoose.model('disc', discSchema);  //set var "Sites" mongoose.model method that create model from the schema above titled "Lists"

module.exports = disc;