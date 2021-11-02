const path = require("path");
const flattenObject = require("../../utils/flattenObject");

var users = require("../../db/users");

var eventSchedule = require("../../db/event");
var uniqueEvents = require("../../utils/generateUniqueEventsFromSchedule")(
  eventSchedule
);

//Sends html page for the current event
//Sends the admin page for admins and
//the standard page for all other requests
function getEventNowHTML(req, res) {
  var html = "event.html";
  if (req.user && req.user.isAdmin) html = "adminEvent.html";

  return res.sendFile(path.join(__dirname, `../../views/${html}`));
}

//Sends event JSON data
//Removes attendance data before sending if user is not admin
function getEventNowJSON(req, res) {
  var now = new Date();
  var registered = false;
  nextEvent = Object.assign({}, getNextEvent(now));

  if (
    req.user &&
    nextEvent.attendance.find((userId) => req.user._id === userId)
  )
    registered = true;

  if (!req.user || !req.user.isAdmin) nextEvent.attendance = [];

  return res.json({ registered, nextEvent });
}

//Checks if a valid eventID was passed to the request
//returns 400 "Bad Request" if eventId was invalid
function parseEventId(req, res, next) {
  if (req.params.eventId === null)
    return res.status(400).send("Invalid Event ID");

  next();
}

//Finds an event with a given id
//returns 404 "Not Found" if no event matches the given ID
function getEventById(req, res, next) {
  res.locals.matchingEvent = uniqueEvents.find(
    (event) => event._id === req.params.eventId
  );

  if (!res.locals.matchingEvent)
    return res.status(404).send("No event found with matching ID");

  next();
}

//Searches through the list of events to find any events on today
//Returns false if no events can be found that are on today
function getNextEventToday(time) {
  var upcomingEventsToday = uniqueEvents
    .filter((event) => time.getYear() === event.year)
    .filter((event) => time.getMonth() === event.month)
    .filter((event) => time.getDate() === event.date)
    .filter((event) => time.getHours() <= event.start.hours);

  var nextEvent;
  if (upcomingEventsToday.length > 0) {
    nextEvent = upcomingEventsToday.reduce((prev, current) =>
      prev.start.hours < current.start.hours ? prev : current
    );
    return nextEvent;
  } else {
    return false;
  }
}

//Finds the next event
//Will try to find the next event today
//if none is found, will find the first event for the next day
function getNextEvent(time) {
  var nextEventToday = getNextEventToday(time);
  if (nextEventToday) {
    return nextEventToday;
  } else {
    time.setDate(time.getDate() + 1);
    time.setHours(1);
    return getNextEvent(time);
  }
}

//Prepares individual user objects from the database for adding to
//attendance CSV
//This will likely be removed when the database is setup
function prepareUserForCsv(user) {
  var { isAdmin, hash, _id, ...tempUser } = user;
  return flattenObject(tempUser);
}

//Takes a list of users and generates a csv as string
//ready to be downloaded
function generateUserCsv(users) {
  //Rename object keys to friendly database column names
  var mapKeysToColumns = [
    { key: "name_first", column: "First Name" },
    { key: "name_last", column: "Last Name" },
    { key: "emergency_name", column: "Emergency Contact Name" },
    { key: "emergency_phone", column: "Emergency Contact Phone" },
    { key: "dob", column: "Date of Birth" },
    { key: "postcode", column: "Postcode" },
    { key: "email", column: "Email" },
  ];

  //Generate csv columns
  var columns = mapKeysToColumns.map((keyToColumn) => keyToColumn.column);
  var csv = columns.join(",") + "\n";

  //Convert each user object into an ordered array of users
  users.forEach((user) => {
    user = prepareUserForCsv(user);
    var csvEntry = mapKeysToColumns.map((keyToColumn) => {
      return user[keyToColumn.key];
    });
    csv += csvEntry.join(",") + "\n";
  });

  return csv;
}

//Validates a given user ID from url query parameter
//Checks to ensure user can be found in database
//Registers user for event if ther can be found
function registerUserForEventById(req, res, next) {
  if (req.query.userId) {
    if (!req.user.isAdmin) return res.status(403).send("User not admin");

    if (!users.find((user) => user._id === req.query.userId))
      return res.status(404).send("User not found");

    //TODO check if user is already registered for this event
    res.locals.matchingEvent.attendance.push(req.query.userId);
    return res.status(200).send(`User ${req.query.userId} has registerd`);
  }
  next();
}

module.exports = {
  getEventNowJSON,
  getEventNowHTML,
  parseEventId,
  getEventById,
  getNextEvent,
  getNextEventToday,
  prepareUserForCsv,
  generateUserCsv,
  registerUserForEventById,
};
