const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let events = new Schema(
  {
    day: {
      type: String,
    },
    start: {
      hours: {
        type: Int,
      },
      minutes: {
        type: Int,
      },
    },
    end: {
      hours: {
        type: Int,
      },
      minutes: {
        type: Int,
      },
    },
    location: {
      type: String,
    },
  },
  { collection: "events" }
);

module.exports = mongoose.model("events", events);
