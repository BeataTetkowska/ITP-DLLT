const eventSchedule = require("../db/event");
const { v4: uuidv4 } = require("uuid");

//Generate a list of unique events for a given number of weeks that can be stored in the database
//Unique events are required in order to attribute user attendance data
//to individual events.
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
  const NUMBEROFWEEKSTOGENERATE = 2;

  events = [];
  for (let i = 0; i < NUMBEROFWEEKSTOGENERATE; i++) {
    let startOfWeek = new Date();
    startOfWeek.setDate(
      startOfWeek.getDate() - startOfWeek.getUTCDay() + i * 7
    );
    startOfWeek.setSeconds(0);
    startOfWeek.setMilliseconds(0);
    startOfWeek = startOfWeek.toISOString();
    let oneWeekOfEvents = generateOneWeekOfEvents(eventSchedule, startOfWeek);
    events = events.concat(oneWeekOfEvents);
  }

  return events;
};

function generateOneWeekOfEvents(eventSchedule, startOfWeek) {
  return eventSchedule.map((event) => {
    var eventDate = new Date(startOfWeek);
    eventDate.setDate(eventDate.getDate() + event.day);
    eventDate.setHours(event.start.hours);
    eventDate.setMinutes(event.start.minutes);
    eventDateIsoString = eventDate.toISOString();

    return {
      //TODO when implementing this using the database, don't generate an id
      //MongoDB will generate the id for us
      ...event,
      _id: uuidv4(),
      attendance: [],
      isoString: eventDateIsoString,
      date: eventDate.getDate(),
      month: eventDate.getMonth(),
      year: eventDate.getYear(),
    };
  });
}
