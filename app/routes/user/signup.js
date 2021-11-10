const path = require("path");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const users = require("../models/user");

//GET /signup -> returns html for signup page
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/signup.html"));
});

//POST /signup -> creates user
router.post("/", parseSignUpRequest, checkIfUserExists, createUser);

//Parses variables sent from frontend into response object
async function parseSignUpRequest(req, res, next) {
  var { password } = req.body;

  let hash = undefined;
  if (password) hash = await bcrypt.hash(password, 10);

  res.locals.user = {
    _id: uuidv4(),
    gdprAccepted: req.body.gdprAccepted,
    marketingAccepted: req.body.marketingAccepted,
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

  //User created manually without email address or password
  if (!res.locals.user.email || !hash) {
    if (req.user && req.user.isAdmin) {
      users.push(res.locals.user);
      return res.status(200).send("User created manually");
    }
    //User must be admin to manually create user
    return res.status(403).send("User not admin");
  }

  next();
}

//Tests to ensure that a user with the same email does not already exist
async function checkIfUserExists(_, res, next) {
  res.locals.userExists = false;
  var testuser = await users.findOne({ email: res.locals.user.email }).exec();
  log.debug(testuser);
  if (testuser) {
    res.locals.userExists = true;
  }

  next();
}

//Attempts to create the user and responds with status
async function createUser(_, res) {
  var success = false;
  if (res.locals.userExists === false) {
    await users.create(res.locals.user);

    success = true;
  }

  users.push(res.locals.user);
  return res.status(201).send(res.locals.user.email);
  //TODO sign user in
}

module.exports = router;
