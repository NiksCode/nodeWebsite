var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var ContactSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  website: String,
  comment: String
});

module.exports = mongoose.model("Contact", ContactSchema);