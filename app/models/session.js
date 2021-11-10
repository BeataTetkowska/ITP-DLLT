const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let uniqueevent = new Schema(
  {
    attendance: {
      type: Array,
    },
    date: {
      type: Int,
    },
    month: {
      type: Int,
    },
    year: {
      type: Int,
    },
    isoString: {
      type: isoString,
    },
    epoch: {
      type: Int,
    },
    day: {
      type: Int,
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
  { collection: "uniqueevent" }
);

module.exports = mongoose.model("uniqueevent", uniqueevent);
