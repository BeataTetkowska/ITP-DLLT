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
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);

    if (!user) return res.status(401).send("Login Failed");

    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(200).send("Login Successful");
    });
  })(req, res, next);
});

module.exports = router;
