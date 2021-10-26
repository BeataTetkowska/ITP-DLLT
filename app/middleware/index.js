const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const session = require("express-session");
const passport = require("./passport");
const logger = require("./logger");

const app = express();

//Sets up all of the middleware required for our app.
//It is useful to keep this in a separate file to keep app.js tidy and
//primarily containing only the application routes
module.exports = () => {
  //Logging with winston used as middleware to log all requests made to backend
  app.use(logger);

  //Express-Sessions for session data
  var secret = process.env.SESSIONSECRET ? process.env.SESSIONSECRET : "secret";
  var sessionArgs = {
    secret: secret,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: false },
  };

  app.use(session(sessionArgs));

  //Passport for authentication
  app.use(passport.initialize());
  app.use(passport.session());

  //HTTP body parse for handling post requests
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  //HTTP body parser for json post requests
  app.use(bodyParser.json());
  //Cookie parser
  app.use(cookieParser());
  //Public folder for images, css and js files
  app.use(express.static(path.join(__dirname, "../public")));
  //Compress files before sending
  app.use(compression());

  //Folder for html/ejs views
  app.set("views", path.join(__dirname, "../views"));

  return app;
};
