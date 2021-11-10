const { v4: uuidv4 } = require("uuid");
const path = require("path");
const flattenObject = require("../../utils/flattenObject");

var users = require("../../db/users");

var eventSchedule = require("../../db/event");
var uniqueEvents = require("../../utils/generateUniqueEventsFromSchedule")(
  eventSchedule
);

function getEventList(req, res) {
  var start = parseInt(req.query.start) || null;
  var end = parseInt(req.query.end) || null;

  if (!start || !end)
    return res.status(400).send("Invalid start/end time supplied");

  var filteredEvents = uniqueEvents
    .filter((event) => event.epoch > start && event.epoch < end)
    .map(({ attendance, ...event }) => event);

  if (filteredEvents.length === 0)
    return res.status(404).send("No events in this range");

  return res.json(filteredEvents);
}

//Sends html page for the current event
//Sends the admin page for admins and
//the standard page for all other requests
function getEventHTML(req, res) {
  var html = "event.html";
  if (req.user && req.user.isAdmin) html = "adminEvent.html";

  return res.sendFile(path.join(__dirname, `../../views/${html}`));
}

//Sends event JSON data
//Removes attendance data before sending if user is not admin
function getEventJSON(req, res, event) {
  var registered = false;

  if (req.user && event.attendance.find((userId) => req.user._id === userId))
    registered = true;

  if (!req.user || !req.user.isAdmin) event.attendance = [];

  return res.json({ registered, event });
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

//Filter events for events in future,
//sort events and take from top of list
function getNextEvent(time) {
  var upcomingEvents = uniqueEvents.filter(
    (event) => time.getTime() < event.epoch
  );
  upcomingEvents.sort((a, b) => a.epoch - b.epoch);
  return upcomingEvents[0];
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

// Pulls all required information from a request intended to modify an session
function parseModifySessionRequest(req, res, next) {
  var { epochStart, start, end, location } = req.body;

  try {
    res.locals.startDate = new Date(epochStart);
  } catch {
    return res.status(400).send("Malformed Request");
  }

  var { startDate } = res.locals;

  res.locals.session = {
    date: startDate.getDate(),
    month: startDate.getMonth(),
    year: startDate.getFullYear(),
    isoString: startDate.toISOString(),
    epoch: epochStart,
    day: startDate.getDay(),
    start,
    end,
    location,
  };

  next();
}

// Adds a unique session to the unique sessions list
function createUniqueSession(_, res, next) {
  uniqueSession = Object.assign({}, res.locals.session);
  uniqueSession._id = uuidv4();
  uniqueSession.attendance = [];

  uniqueEvents.push(uniqueSession);
  next();
}

// Adds an session to the session schedule
function addSessionToSchedule(req, res, next) {
  if (req.query.addToSchedule !== "true") return next();

  var {
    date,
    month,
    year,
    isoString,
    epoch,
    ...sessionForSchedule
  } = res.locals.session;

  sessionForSchedule._id = uuidv4();

  eventSchedule.push(sessionForSchedule);
  //FIXME Currently after the event is added to the schedule, no additional
  //unique events are generated
  //TODO when moving to the database, a check should be run to see if more unique events should be generated

  next();
}

//Validates a given user ID from url query parameter
//Checks to ensure user can be found in database
//Registers user for event if ther can be found
function deregisterUserForEventById(req, res) {
  var index = res.locals.matchingEvent.attendance.findIndex(
    (user) => (user._id = req.params.userId)
  );

  if (index < 0)
    return res.status(404).send("User was not registered for event");

  res.locals.matchingEvent.attendance.splice(index, 1);
  return res.status(200).send(`User ${req.params.userId} has deregisterd`);
}

module.exports = {
  getEventJSON,
  getEventHTML,
  parseEventId,
  getEventById,
  getNextEvent,
  prepareUserForCsv,
  parseModifySessionRequest,
  createUniqueSession,
  addSessionToSchedule,
  generateUserCsv,
  registerUserForEventById,
  getEventList,
  deregisterUserForEventById,
};
