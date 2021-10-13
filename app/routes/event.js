const express = require("express");
var viewRouter = express.Router();
var apiRouter = express.Router();

var events = require("../db/event");

//GET /event -> returns html for event page
viewRouter.get("/", (req, res) => {
  //TODO send html
  res.send("Events page");
});

//GET /api/event -> returns json data for next event
apiRouter.get("/", (req, res) => {
  //TODO find next event
  res.json(events[0]);
});

module.exports = {
  view: viewRouter,
  api: apiRouter,
};
