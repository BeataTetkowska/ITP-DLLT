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

async function sendPasswordResetToken(_, res, next) {
  res.locals.token = crypto.randomBytes(20).toString("hex");
  var tokenHash = await bcrypt.hash(res.locals.token, 2);

  res.locals.matchingUser.resetTokenHash = tokenHash;
  res.locals.matchingUser.resetTokenExpires = Date.now() + 1000 * 60 * 30;

  var index = users.findIndex(
    (user) => (user._id = res.locals.matchingUser._id)
  );
  users[index] = res.locals.matchingUser;

  const emailData = {
    from: SMTPUSER,
    subject: "Streetsport Password Reset",
    to: res.locals.matchingUser.email,
  };

  var link = `${PROTOCOL}${HOST}:${HTTPPORT}/user/password/reset\
?resetToken=${res.locals.token}&email=${res.locals.matchingUser.email}`;
  sendTextEmail(emailData, link);

  next();
}

module.exports = {
  resetPassword,
  getUserByEmail,
  sendPasswordResetToken,
};
