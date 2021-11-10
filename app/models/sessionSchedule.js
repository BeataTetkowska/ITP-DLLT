const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let sessionSchedule = new Schema(
  {
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
  { collection: "sessionSchedule" }
);

module.exports = mongoose.model("sessionSchedule", sessionSchedule);
