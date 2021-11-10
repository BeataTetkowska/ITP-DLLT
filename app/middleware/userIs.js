//Checks if user is logged in
const loggedIn = (req, res, next) => {
  if (!req.user) return res.status(401).send("Not logged in");
  next();
};

//Checks if user is admin or not
const admin = (req, res, next) => {
  if (!req.user) return res.status(401).send("Not logged in");

  if (!req.user.isAdmin) return res.status(403).send("User is not admin");
  next();
};

module.exports = {
  loggedIn,
  admin,
};
