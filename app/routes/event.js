const path = require("path");
const express = require("express");
var viewRouter = express.Router();
var apiRouter = express.Router();
var adminViewRouter = express.Router();
var adminApiRouter = express.Router();

var events = require("../db/event");
var users = require("../db/users");

//GET /event -> returns html for event page
viewRouter.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../views/event.html"));
});

//GET /api/event -> returns json data for next event
apiRouter.get("/", (_, res) => {
  //Get current date and time
  var now = new Date();

  nextEvent = getNextEvent(now);

  res.json(nextEvent);
});

// GET /admin/event -> event html with attendance
adminViewRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/adminEvent.html"));
});

// GET /admin/event/attendance
// -> find users attending current event and return name and emergency contact
adminApiRouter.get("/attendance", (req, res) => {
  //TODO find event which is currently on
  //This should be informed by the current time and information sent
  //from the frontend for confirmation
  //
  //TODO Check if there are any users which have registered for this event
  //Filter the results to only include the name and emergency contact
  //send the results as json
  res.send("Not Implemented");
});

module.exports = {
  view: viewRouter,
  api: apiRouter,
  adminView: adminViewRouter,
  adminApi: adminApiRouter,
};

//Searches through the list of events to find any events on today
//Returns false if no events can be found that are on today
function getNextEventToday(time) {
  var upcomingEventsToday = events
    .filter((event) => time.getUTCDay() == event.day)
    .filter((event) => time.getHours() < event.start.hours);

  var nextEvent;
  if (upcomingEventsToday.length > 0) {
    nextEvent = upcomingEventsToday.reduce((prev, current) =>
      prev.hours < current.hours ? prev : current
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
    time.setHours(0);
    nextEvent = getNextEvent(time);
  }
  return nextEvent;
}
