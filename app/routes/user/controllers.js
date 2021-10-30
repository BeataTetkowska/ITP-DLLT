const crypto = require("crypto");
const bcrypt = require("bcrypt");
var users = require("../../db/users");

async function resetPassword(req, res, next) {
  var isMatch = await bcrypt.compare(
    req.body.token,
    res.locals.matchingUser.resetTokenHash
  );
  if (!isMatch) {
    res.json(401, {
      success: false,
      message: "Password reset token is incorrect",
    });
    return;
  }

  res.locals.matchingUser.hash = await bcrypt.hash(req.body.password, 10);
  next();
}

function getUserByEmail(req, res, next) {
  res.locals.matchingUser = users.find((user) => user.email === req.body.email);

  if (!res.locals.matchingUser) {
    //Can't give clear indication to frontend that no user was found
    //due to security concerns
    res.sendStatus(200);
    return;
  }
  next();
}

async function sendPasswordResetToken(req, res, next) {
  res.locals.token = crypto.randomBytes(20).toString("hex");
  var tokenHash = await bcrypt.hash(res.locals.token, 2);

  res.locals.matchingUser.resetTokenHash = tokenHash;
  res.locals.matchingUser.resetTokenExpires = Date.now() + 1000 * 60 * 30;

  //TODO email user with password reset token
  next();
}

module.exports = {
  resetPassword,
  getUserByEmail,
  sendPasswordResetToken,
};
