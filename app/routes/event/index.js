const { generateUserCsv } = require("./controllers");
var router = require("express").Router();

var users = require("../../db/users");

const log = require("../../utils/winstonLogger");

const userIs = require("../../middleware/userIs");
const {
  getEventNowJSON,
  getEventNowHTML,
  parseEventId,
  getEventById,
  registerUserForEventById,
} = require("./controllers");

//GET /event -> returns event data html or json
router.get("/", (req, res) => {
  res.format({
    html: () => getEventNowHTML(req, res),
    json: () => getEventNowJSON(req, res),
  });
});

//GET /event/:eventId -> returns event JSON data for a given eventId
router.get("/:eventId", parseEventId, getEventById, (req, res) => {
  var eventCopy = Object.assign({}, res.locals.matchingEvent);
  if (!req.user || !req.user.isAdmin) {
    eventCopy = null;
  }
  res.json(eventCopy);
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
    res.json({ success: true, message: "Current user has registered" });
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
