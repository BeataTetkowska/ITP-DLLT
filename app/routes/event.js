const path = require("path");
const express = require("express");
var viewRouter = express.Router();
var apiRouter = express.Router();
var adminViewRouter = express.Router();
var adminApiRouter = express.Router();
const log = require("../utils/winstonLogger");
const userIs = require("../middleware/userIs");

var users = require("../db/users");
var eventSchedule = require("../db/event");

var uniqueEvents = require("../utils/generateUniqueEventsFromSchedule")(
  eventSchedule
);

//GET /event -> returns html for event page
viewRouter.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../views/event.html"));
});

//GET /api/event -> returns json data for next event
apiRouter.get("/", (_, res) => {
  //Get current date and time
  var now = new Date();

  nextEvent = getNextEvent(now);

  //TODO remove attendance data from response
  res.json(nextEvent);
});

// GET /admin/event -> event html with attendance
adminViewRouter.get("/", userIs.admin, (_, res) => {
  res.sendFile(path.join(__dirname, "../views/adminEvent.html"));
});

// POST /api/admin/event/attendance
// -> find users attending current event and return name and emergency contact
// Takes an event ID
adminApiRouter.post("/attendance", userIs.admin, (req, res, next) => {
  var matchingEvent = uniqueEvents.find(
    (event) => event._id === req.body.eventId
  );

  if (!matchingEvent) {
    res.json({
      result: {
        success: false,
        message: "No event found with matching ID",
        users: [],
      },
    });
    return next();
  }

  var matchingUserDetails = [];
  matchingEvent.attendance.forEach((userID) => {
    let user = users.find((user) => {
      if (user._id === userID) {
        return true;
      }
    });
    if (user) {
      matchingUserDetails.push({
        _id: user._id,
        name: user.name,
        emergency: user.emergency,
      });
    }
  });

  res.json({
    result: {
      success: true,
      message: "Event found, returning registered users",
      users: matchingUserDetails,
    },
  });
});

//POST /api/event/register
//-> takes an event ID registers user for that event
//registers user for event if a matching event exists
apiRouter.post("/register", (req, res, next) => {
  if (!req.user) {
    res.status(401);
    res.json({ result: { success: false, message: "User is not signed in" } });
    return;
  }

  var matchingEvent = uniqueEvents.find(
    (event) => event._id === req.body.eventId
  );

  if (!matchingEvent) {
    res.json({
      result: { success: false, message: "No event found with matching ID" },
    });
    return next();
  }

  //TODO check if event has passed or starts more than 30 minutes in the future
  matchingEvent.attendance.push(req.user._id);
  res.json({ result: { success: true, message: "User has registered" } });
});

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

module.exports = {
  view: viewRouter,
  api: apiRouter,
  adminView: adminViewRouter,
  adminApi: adminApiRouter,
  getNextEvent,
  getNextEventToday,
};
