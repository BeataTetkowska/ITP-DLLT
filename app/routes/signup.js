const path = require("path");
const express = require("express");
var router = express.Router();
const log = require("../utils/winstonLogger");
const bcrypt = require("bcrypt");

const user = require("../models/user");

//GET /signup -> returns html for signup page
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/signup.html"));
});

//POST /signup -> creates user
router.post("/", parseSignUpRequest, checkIfUserExists, createUser);

//Parses variables sent from frontend into response object
async function parseSignUpRequest(req, res, next) {
  var { password } = req.body;

  password = await bcrypt.hash(password, 10);

  res.locals.user = {
    name: {
      first: req.body.firstName,
      last: req.body.lastName,
    },
    email: req.body.email,
    password: password,
  };

  next();
}

//Tests to ensure that a user with the same email does not already exist
function checkIfUserExists(_, res, next) {
  res.locals.userExists = false;

  user.findOne({ email: res.locals.user.email }, (err, data) => {
    if (err) {
      next(err);
    }

    if (data !== null) {
      res.locals.userExists = true;
    }

    next();
  });
}

//Attempts to create the user and responds with status
function createUser(_, res) {
  var success = false;
  res.statusCode = 409;
  if (res.locals.userExists === false) {
    success = true;
    res.statusCode = 201;
    user.create(res.locals.user);
  }

  res.locals.response = {
    email: res.locals.user.email,
    result: {
      success: success,
    },
  };

  log.debug(res.locals.response);
  res.json(res.locals.response);
}

module.exports = router;
