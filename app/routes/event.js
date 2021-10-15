const path = require("path");
const express = require("express");
var viewRouter = express.Router();
var apiRouter = express.Router();

var events = require("../db/event");

//GET /event -> returns html for event page
viewRouter.get("/", (_, res) => {
  //TODO send html
  res.sendFile(path.join(__dirname, "../views/event.html"));
});

//GET /api/event -> returns json data for next event
apiRouter.get("/", (_, res) => {
  //Get current date and time
  var now = new Date();

  nextEvent = getNextEvent(now);

  res.json(nextEvent);
});

module.exports = {
  view: viewRouter,
  api: apiRouter,
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
