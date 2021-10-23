const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let user = new Schema({
  fname: { type: String },
  lname: { type: String },
  email: { type: String },
  password: { type: String },
});

//Creates a collection (table) in mongodb in our database names users (note lowercase and plural)
module.exports = mongoose.model("User", user);
