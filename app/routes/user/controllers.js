const {
  PROTOCOL,
  HOST,
  HTTPPORT,
  SMTPUSER,
} = require("../../utils/dotenvDefaults");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
var users = require("../../db/users");
const { sendTextEmail } = require("../../utils/sendEmail");

//Searches the database for the user using an email address provided in request body
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

//Generates and emails a password reset token to a user
//Hashes the token and stores the hash in the database
async function sendPasswordResetToken(_, res, next) {
  //Generate new token, tokenHash and token expirty date
  token = crypto.randomBytes(20).toString("hex");
  res.locals.matchingUser.resetTokenHash = await bcrypt.hash(token, 2);
  res.locals.matchingUser.resetTokenExpires = Date.now() + 1000 * 60 * 30;

  //Update user in database
  var index = users.findIndex(
    (user) => (user._id = res.locals.matchingUser._id)
  );
  users[index] = res.locals.matchingUser;

  //Email data for sending email
  const emailData = {
    from: SMTPUSER,
    subject: "Streetsport Password Reset",
    to: res.locals.matchingUser.email,
  };

  //Generated password reset link for user to reset email, including token
  var link = `${PROTOCOL}${HOST}:${HTTPPORT}/user/password/reset\
?resetToken=${token}&email=${res.locals.matchingUser.email}`;
  sendTextEmail(emailData, link);

  next();
}

//Checks whether a valid password reset request has been passed
//Checks, token and email match the database record
//and that token has not expired
async function resetPassword(req, res, next) {
  var {
    resetTokenHash: tokenHash,
    resetTokenExpires: tokenExpires,
  } = res.locals.matchingUser;

  //Check if password reset has ever been initated for this user
  if (!tokenHash || !req.body.token) {
    res.json(403, { success: false, message: "Password reset not initiated" });
    return;
  }

  //Check if token matched
  var isMatch = await bcrypt.compare(req.body.token, tokenHash);
  if (!isMatch) {
    res.json(403, { success: false, message: "Reset token is incorrect" });
    return;
  }

  //Check if token has expired
  if (tokenExpires < Date.now()) {
    res.json(403, { success: false, message: "Reset token has expired" });
    return;
  }

  //Update user's password
  res.locals.matchingUser.hash = await bcrypt.hash(req.body.password, 10);
  next();
}

module.exports = {
  resetPassword,
  getUserByEmail,
  sendPasswordResetToken,
};
