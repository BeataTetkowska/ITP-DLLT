//Checks if user is logged in
const loggedIn = (req, res) => {
  if (!req.user) {
    res.status(401);
    next("User is not logged in");
  }
  next();
};

//Checks if user is admin or not
const admin = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    next("User is not logged in");
  }
  if (!req.user.isAdmin) {
    res.status(401);
    next("User is not admin");
  }
  next();
};

module.exports = {
  loggedIn,
  admin,
};
