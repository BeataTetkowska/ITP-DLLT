const { generateUserCsv } = require("./controllers");
var router = require("express").Router();

var users = require("../../db/users");

const userIs = require("../../middleware/userIs");
const {
  getNextEvent,
  getEventJSON,
  getEventHTML,
  getEventList,
  parseEventId,
  getEventById,
  registerUserForEventById,
} = require("./controllers");

//GET /event -> returns event data html or json
router.get("/", (req, res) => {
  var now = new Date();
  nextEvent = Object.assign({}, getNextEvent(now));

  res.format({
    html: () => getEventHTML(req, res),
    json: () => getEventJSON(req, res, nextEvent),
  });
});

router.get("/list", getEventList);

//GET /event/:eventId -> returns event JSON data for a given eventId
router.get("/:eventId", parseEventId, getEventById, (req, res) => {
  return res.format({
    html: () => getEventHTML(req, res),
    json: () => getEventJSON(req, res, res.locals.matchingEvent),
  });
});

//PUT /event/:eventId/register?userId
//-> takes an event ID
//-> registers currently signed in user for that event
//If userId is passed as url param and signed in user is admin
//-> register the given user for the event
router.put(
  "/:eventId/register",
  userIs.loggedIn,
  parseEventId,
  getEventById,
  registerUserForEventById,
  (req, res) => {
    //TODO check if event has passed or starts more than 30 minutes in the future
    //TODO check if user is already registered for this event
    res.locals.matchingEvent.attendance.push(req.user._id);
    res.status(200).send("Current user has registered");
  }
);

// GET /event/:eventId/attendance
// -> takes eventId
// -> returns users attending given eventId
// -> returns csv with full user attendance details when
// Accept: text/csv header is sent
router.get(
  "/:eventId/attendance",
  userIs.admin,
  parseEventId,
  getEventById,
  (_, res) => {
    var matchingUserDetails = [];
    res.locals.matchingEvent.attendance.forEach((userID) => {
      let user = users.find((user) => user._id === userID);
      if (user) matchingUserDetails.push(user);
    });

    if (matchingUserDetails.length === 0)
      return res.status(404).send("No users registered for event");

    return res.format({
      json: () =>
        res.json(
          matchingUserDetails.map((user) => ({
            _id: user._id,
            name: user.name,
            emergency: user.emergency,
          }))
        ),
      "text/csv": () => {
        var csvString = generateUserCsv(matchingUserDetails);
        let { isoString } = res.locals.matchingEvent;
        var fileName = `Session-${isoString}--Attendance.csv`;
        res.json({ fileName: fileName, data: csvString });
      },
    });
  }
);

module.exports = router;
