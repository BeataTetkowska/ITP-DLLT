const path = require("path");
router = require("express").Router();
const {
  resetPassword,
  getUserByEmail,
  sendPasswordResetToken,
} = require("./controllers");

// GET /user/password -> form to initiate password reset
router.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../../views/initiatePasswordReset.html"));
});

// POST /user/password
// -> takes users email
// -> Initiates password reset
router.post("/", getUserByEmail, sendPasswordResetToken, (_, res) => {
  //TODO, user shold be redirected to login page, may be better
  //to perform the redirect on the client side after notifying the user of success
  //res.redirect("/user/login");
  return res.sendStatus(200);
});

// GET /user/password/reset -> form to complete password reset
router.get("/reset", (_, res) => {
  res.sendFile(path.join(__dirname, "../../views/completePasswordReset.html"));
});

// PUT /user/password/reset
// -> takes users new password and token to confirm
// -> completes password reset
router.put("/reset", getUserByEmail, resetPassword, (_, res) => {
  //Response has to be the same as in getUserByEmail, when email is not found
  return res.sendStatus(200);
});

module.exports = router;
