const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let user = new Schema(
  {
    isAdmin: {
      type: Boolean,
    },
    name: {
      first: {
        type: String,
      },
      last: {
        type: String,
      },
    },
    email: {
      type: String,
      unique: true,
    },
    hash: {
      type: String,
    },
    dob: {
      type: String,
    },
    postcode: {
      type: String,
    },
    emergency: {
      phone: {
        type: String,
      },
      name: {
        type: String,
      },
    },
  },
  { collection: "users" }
);

module.exports = mongoose.model("users", user);
