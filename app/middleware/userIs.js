//Checks if user is logged in
const loggedIn = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    res.format({
      json: () =>
        res.json({ success: false, message: "User is not logged in" }),
      html: () => res.send("User is not logged in"),
    });
    return;
  }
  next();
};

//Checks if user is admin or not
const admin = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    res.format({
      json: () =>
        res.json({ success: false, message: "User is not logged in" }),
      html: () => res.send("User is not logged in"),
    });
    return;
  }
  if (!req.user.isAdmin) {
    res.status(403);
    res.format({
      json: () => res.json({ success: false, message: "User is not admin" }),
      html: () => res.send("User is not admin"),
    });
    return;
  }
  next();
};

module.exports = {
  loggedIn,
  admin,
};
