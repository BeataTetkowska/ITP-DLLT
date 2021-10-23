const express = require("express");
var router = express.Router();
const log = require("../utils/winstonLogger");

const user = require("../models/user");

// The following routes are examples of how to perform standard
// CRUD operations with Mongoose. They can be used as templates
// All the routes use GET just for the convenience of being
// able to type queries into your browser but the correct HTTP methods
// have also been included

// Example of CRUD: Create
// This is a bad example as a check to see if the user already exists should be performed first
// In production the HTTP method should be POST
// GET -> /api/users/new takes ?email as query and creates a new user in the database
// Example URL: http://localhost:8080/api/users/new?email=email@test.com
router.get("/new", (req, res, next) => {
  let email = req.query.email;
  user.create({ email: email }, (err, data) => {
    if (err) {
      return next(err);
    }
    res.send(data);
  });
});

// Example of CRUD: Read
// GET /api/users -> returns all users in database
// Example URL: http://localhost:8080/api/users
router.get("/", (req, res, next) => {
  user.find({}, (err, data) => {
    if (err) {
      return next(err);
    }
    res.send(data);
  });
});

// Example of CRUD: Read for a single entry
// GET /api/users/find -> takes ?email as query and returns the user with matching email
// Example URL: http://localhost:8080/api/users/find/?email=email@test.com
router.get("/find", (req, res, next) => {
  let email = req.query.email;
  user.findOne({ email: email }, (err, data) => {
    if (err) {
      return next(err);
    }

    let returnValue;
    if (data === null) {
      returnValue = "No user found within database";
    } else {
      returnValue = data;
    }

    res.send(returnValue);
  });
});

// Example of CRUD: Update
// In production the HTTP method should be PATCH if updating some fields, PUT if replacing the whole record
// GET /api/users/update
// -> takes ?oldemail and ?newemail as queries
// Changes oldemail to newemail in database and returns the number of updated records
// Example URL: http://localhost:8080/api/users/update/?oldemail=email@test.com&newemail=newemail@test.com
router.get("/update", (req, res, next) => {
  let oldEmail = req.query.oldemail;
  let newEmail = req.query.newemail;

  user.updateOne({ email: oldEmail }, { email: newEmail }, (err, data) => {
    if (err) {
      return next(err);
    }

    res.send(data);
  });
});

// Example of CRUD: Delete
// In production the HTTP method should be DELETE
// GET /api/users/delete -> takes ?email as query and deletes the user with matching email
// Example URL: http://localhost:8080/api/users/delete/?email=email@test.com
router.get("/delete", (req, res, next) => {
  let email = req.query.email;
  user.deleteOne({ email: email }, (err, result) => {
    if (err) {
      return next(err);
    }
    res.send(result);
  });
});

// Example of CRUD: Delete
// In production the HTTP method should be DELETE
// GET /api/users/cleardatabase -> deletes all users and reutrns number of deleted records
// Example URL: http://localhost:8080/api/users/cleardatabase
router.get("/cleardatabase", (req, res, next) => {
  user.deleteMany({}, (err, result) => {
    if (err) {
      return next(err);
    }
    res.send(result);
  });
});

module.exports = router;
