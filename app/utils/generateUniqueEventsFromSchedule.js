const eventSchedule = require("../db/event");
const { v4: uuidv4 } = require("uuid");

//Generate a list of unique events for this week which can be stored in the database
//Unique events are required in order to attribute user attendance data
//to individual events.
//Individual events have the following structure
// Unique event schema is as follows
// {
//   _id:
//   attendance: [] // List of users which have registerd for the event
//   date: // dayOfMonth for the event
//   month: // monthOfYear for the event
//   year:
//   isoString: //ISO Standard date string for quick comparison
//   day: // dayOfWeek for the event
//   start: {
//     hours:
//     minutes:
//   },
//   end: {
//     hours:
//     minutes:
//   },
//   location:
// }
module.exports = () => {
  var startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getUTCDay());
  var startOfWeek = startOfWeek.toISOString();

  return eventSchedule.map((event) => {
    var eventDate = new Date(startOfWeek);
    eventDate.setDate(eventDate.getDate() + event.day);
    eventDateIsoString = eventDate.toISOString();

    return {
      _id: uuidv4(),
      attendance: [],
      isoString: eventDateIsoString,
      date: eventDate.getDate(),
      month: eventDate.getMonth(),
      year: eventDate.getYear(),
      ...event,
    };
  });
};
