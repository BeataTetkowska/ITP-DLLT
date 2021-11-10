const bodyParser = require("body-parser");
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
      full: {
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
    gdprAccepted: {
      type: Boolean,
    },
    marketingAccepted: {
      type: Boolean,
    },
    resetTokenHash: {
      type: String,
    },
    resetTokenExpires: {
      type: Number,
    },
  },
  { collection: "users" }
);

module.exports = mongoose.model("users", user);
