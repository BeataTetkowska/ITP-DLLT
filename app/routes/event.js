const express = require("express");
var router = express.Router();

//An example of what data may be included within a single event
currentEventExample = {
  id: 1,
  ts: new Date().toISOString(),
  location: "Cruyff Court",
};

//Example route for sending only the JSON data for a single event
router.get("/", (req, res) => {
  res.json(currentEventExample);
});

module.exports = router;
