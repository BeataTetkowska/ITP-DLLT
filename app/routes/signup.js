const express = require("express");
var router = express.Router();
const log = require("../utils/winstonLogger");
const bcrypt = require("bcrypt");

const users = require("../db/users");

//GET /signup -> returns html for signup page
router.get("/", (req, res) => {
  res.send("Signup Page");
});

//POST /signup -> creates user
router.post("/", parseSignUpRequest, checkIfUserExists, createUser);

//Parses variables sent from frontend
async function parseSignUpRequest(req, res, next) {
  var { password } = req.body;

  password = await bcrypt.hash(password, 10);

  res.locals.user = { ...req.body, password: res.locals.password };
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
    users.push(res.locals.user);
    success = true;
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
