const path = require("path");
const express = require("express");
var router = express.Router();

var events = require("../db/event");

//GET /login -> returns html for login page
router.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

//POST /login -> checks if credentials are accurate and logs the user in
router.get("/", (_, res) => {
  res.send("To be Implemented");
});

module.exports = router;
