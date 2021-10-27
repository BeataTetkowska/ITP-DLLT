const path = require("path");
const express = require("express");
var router = express.Router();
const log = require("../../utils/winstonLogger");
const bcrypt = require("bcrypt");

const users = require("../../db/users");

//GET /signup -> returns html for signup page
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/signup.html"));
});

//POST /signup -> creates user
router.post("/", parseSignUpRequest, checkIfUserExists, createUser);

//Parses variables sent from frontend into response object
async function parseSignUpRequest(req, res, next) {
  var { password } = req.body;

  let hash = await bcrypt.hash(password, 10);

  res.locals.user = {
    name: {
      first: req.body.firstName,
      last: req.body.lastName,
    },
    email: req.body.email,
    hash: hash,
    dob: req.body.dateOfBirth,
    postcode: req.body.postcode,
    emergency: {
      phone: req.body.emergencyName,
      name: req.body.phoneNumber,
    },
  };

  next();
}

//Tests to ensure that a user with the same email does not already exist
function checkIfUserExists(_, res, next) {
  res.locals.userExists = false;
  if (users.filter((user) => user.email === res.locals.user.email).length > 0) {
    res.locals.userExists = true;
  }

  next();
}

//Attempts to create the user and responds with status
function createUser(_, res) {
  var success = false;
  if (res.locals.userExists === false) {
    res.locals.user._id = users.length + 1;
    users.push(res.locals.user);
    success = true;
    //TODO sign user in
  }

  res.locals.response = {
    email: res.locals.user.email,
    result: {
      success: success,
    },
  };

  res.statusCode = 201;
  res.json(res.locals.response);
}

module.exports = router;
