const path = require("path");
const express = require("express");
var router = express.Router();
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
  if (res.locals.userExists) {
    return res.status(409).send("Email taken");
  }

  res.locals.user._id = users.length + 1;
  users.push(res.locals.user);
  return res.status(201).send(res.locals.user.email);
  //TODO sign user in
}

module.exports = router;
