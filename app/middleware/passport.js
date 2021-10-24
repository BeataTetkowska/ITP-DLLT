var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const users = require("../db/users");

//Serialises user object in preparation for storing in the sessions database
passport.serializeUser(function (user, done) {
  done(null, {
    _id: user._id,
    email: user.email,
    isAdmin: user.isAdmin ? true : false,
  });
});

//Returns user object untouched without database query
passport.deserializeUser(function (user, done) {
  done(null, user);
});

//Locally stored passwords strategy
//Takes an email and password from post request
//Searches the database for the corresponding email
//Hashes the password if there were results and returns
//The appropriate user
passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
    },
    async function (req, email, password, done) {
      let matchingUser = users.filter((user) => user.email === email)[0];

      //No user found with matching email address
      if (matchingUser === undefined) {
        return done(null, false, {
          errorCode: 1,
          message: "Incorrect email",
        });
      }

      var isMatch = await bcrypt.compare(password, matchingUser.hash);

      if (!isMatch) {
        return done(null, false, {
          errorCode: 2,
          message: "Incorrect password.",
        });
      }

      return done(null, matchingUser);
    }
  )
);

module.exports = passport;
