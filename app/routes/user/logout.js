var router = require("express").Router();

// GET /user/logout -> logs out user
// Sets loggedin value to false if the user was loggedin
router.get("/", (req, res) => {
  if (!req.user) return res.status(200).send("User not logged in");

  req.logout();
  return res.status(200).send("Logout successful");
});

module.exports = router;
