const path = require("path");
const express = require("express");
var router = express.Router();
const passport = require("../../middleware/passport");

//GET /login -> returns html for login page
router.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../../views/login.html"));
});

//POST /login -> checks if credentials are accurate and logs the user in
router.post("/", async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      next(err);
      return;
    }

    var formResponse = {
      result: {
        badPassword: null,
        bademail: null,
        success: false,
        isAdmin: false,
      },
    };

    if (!user) {
      if (info.errorCode === 2) {
        formResponse.result.badPassword = true;
      }
      if (info.errorCode === 1) {
        formResponse.result.bademail = true;
      }
      res.status(401);
      res.json(formResponse);
      return;
    }

    req.login(user, (err) => {
      if (err) {
        next(err);
        return;
      }
      formResponse.result.isAdmin = user.isAdmin;
      formResponse.result.success = true;
      res.json(formResponse);
      return;
    });
  })(req, res, next);
});

module.exports = router;
