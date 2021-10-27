var router = require("express").Router();

var users = require("../../db/users");

const userIs = require("../../middleware/userIs");
const {
  getEventNowJSON,
  getEventNowHTML,
  parseEventId,
  getEventById,
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
  if (!req.user || !req.user.isAdmin) {
    res.locals.matchingEvent.attendance = [];
  }
  res.json(res.locals.matchingEvent);
});

//PUT /event/:eventId/register
//-> takes an event ID
//-> registers currently signed in user for that event
router.put(
  "/:eventId/register",
  userIs.loggedIn,
  parseEventId,
  getEventById,
  (req, res) => {
    //TODO check if event has passed or starts more than 30 minutes in the future
    res.locals.matchingEvent.attendance.push(req.user._id);
    res.json({ success: true, message: "User has registered" });
  }
);

// GET /event/:eventId/attendance
// -> takes eventId
// -> returns users attending given eventId
router.get(
  "/:eventId/attendance",
  userIs.admin,
  parseEventId,
  getEventById,
  (_, res) => {
    var matchingUserDetails = [];
    res.locals.matchingEvent.attendance.forEach((userID) => {
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
      success: true,
      message: "Event found, returning registered users",
      users: matchingUserDetails,
    });
  }
);

module.exports = router;
