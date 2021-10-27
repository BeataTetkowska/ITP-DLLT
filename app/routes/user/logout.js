var router = require("express").Router();

// GET /logout -> logs out user
// Sets loggedin value to false if the user was loggedin
router.get("/", (req, res) => {
  if (req.user) {
    req.logout();
    res.json({ success: true, message: "logout successful" });
  } else {
    res.json({ success: false, message: "User not signed in" });
  }
});

module.exports = router;
