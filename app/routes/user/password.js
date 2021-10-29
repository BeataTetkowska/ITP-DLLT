const path = require("path");
router = require("express").Router();

// GET /user/password -> form to initiate password reset
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/initiatePasswordReset.html"));
});

// POST /user/password
// -> takes users email
// -> Initiates password reset
router.post("/", (req, res) => {
  res.send("To be implemented");
});

// GET /user/password/reset -> form to complete password reset
router.get("/reset", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/completePasswordReset.html"));
});

// PUT /user/password/reset
// -> takes users new password and token to confirm
// -> completes password reset
router.put("/reset", (req, res) => {
  res.send("to be implemented");
});

module.exports = router;
