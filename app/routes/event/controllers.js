const path = require("path");

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
  if (req.user && req.user.isAdmin) {
    html = "adminEvent.html";
  }
  res.sendFile(path.join(__dirname, `../../views/${html}`));
}

//Sends event JSON data
//Removes attendance data before sending if user is not admin
function getEventNowJSON(req, res) {
  var now = new Date();
  nextEvent = Object.assign({}, getNextEvent(now));

  if (!req.user || !req.user.isAdmin) {
    nextEvent.attendance = null;
  }

  res.json(nextEvent);
}

//Checks if a valid eventID was passed to the request
//returns 400 "Bad Request" if eventId was invalid
function parseEventId(req, res, next) {
  req.params.eventId = parseInt(req.params.eventId) || null;
  if (req.params.eventId === null) {
    res.status(400);
    res.format({
      json: () => ({ success: false, message: "Event ID invalid" }),
      html: () => "Event ID invalid",
    });
    return;
  }
  return next();
}

//Finds an event with a given id
//returns 404 "Not Found" if no event matches the given ID
function getEventById(req, res, next) {
  res.locals.matchingEvent = uniqueEvents.find(
    (event) => event._id === req.params.eventId
  );

  if (!res.locals.matchingEvent) {
    res.status(404);
    res.format({
      json: () => ({
        result: { success: false, message: "No event found with matching ID" },
      }),
      html: () => "No event found with matching ID",
    });
    return;
  }
  return next();
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

//Validates a given user ID from url query parameter
//Checks to ensure user can be found in database
//Registers user for event if ther can be found
//TODO split up this function
function registerUserForEventById(req, res, next) {
  if (req.user.isAdmin && req.query.userId) {
    req.query.userId = parseInt(req.query.userId) || null;
    if (req.query.userId === null) {
      res.json(400, { success: false, message: "User ID invalid" });
      return;
    }

    if (!users.find((user) => user._id === req.query.userId)) {
      res.json(404, { success: false, message: "User not found" });
      return;
    }

    //TODO check if user is already registered for this event
    res.locals.matchingEvent.attendance.push(req.query.userId);
    res.json({
      success: true,
      message: `User ${req.query.userId} has registered`,
    });
    return;
  }
  if (req.query.userId && !req.query.isAdmin) {
    return res.sendStatus(403);
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
  registerUserForEventById,
};
