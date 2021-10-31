var users = require("../../db/users");

//Removes user from users table and logs out user
module.exports = (req, res) => {
  var index = users.findIndex((user) => {
    return req.user._id == user._id;
  });

  users.pop(index);
  req.logout();
  res.sendStatus(200);
};
