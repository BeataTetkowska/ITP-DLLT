const path = require("path");
const router = require("express").Router();

const users = require("../../db/users");
const userIs = require("../../middleware/userIs");

// GET /user -> JSON data for logged in user
// -> or HTML page with for signed in user
router.get(
  "/",
  userIs.loggedIn,
  findUserById,
  removeSensitiveUserfields,
  (_, res) =>
    res.format({
      html: () => res.sendFile(path.join(__dirname, "../../views/user.html")),
      json: () => res.json(res.locals.matchingUser),
    })
);

// GET /user/:userId -> JSON data for the given userId
router.get(
  "/:userId",
  userIs.admin,
  findUserById,
  removeSensitiveUserfields,
  (_, res) =>
    res.format({
      html: () =>
        res.sendFile(path.join(__dirname, "../../views/userDetails.html")),
      json: () => res.json(res.locals.matchingUser),
    })
);

// PATCH /user -> takes JSON data for user
// Updates signed in user with input fields
router.patch(
  "/",
  userIs.loggedIn,
  findUserById,
  updateUserfields,
  removeSensitiveUserfields,
  (_, res) => res.json(res.locals.matchingUser)
);

//DELETE /user -> deletes logged in user
router.delete("/", userIs.loggedIn, deleteUser);

//Removes user from users table and logs out user
function deleteUser(req, res) {
  var index = users.findIndex((user) => req.user._id == user._id);

  if (index < 0) return res.status(404).send("User not found");

  users.splice(index, 1);
  req.logout();
  return res.status(200).send("User Deleted");
}

// Finds a user by their ID and adds to res.locals.matchingUser
// Returns 404 if user is not found
function findUserById(req, res, next) {
  var userIdToFind = req.user._id;
  if (req.user.isAdmin && req.params.userId) userIdToFind = req.params.userId;
  res.locals.matchingUser = users.find((user) => user._id === userIdToFind);

  if (!res.locals.matchingUser) return res.status(404).send("User not found");

  next();
}

// Copies user object and removes sensitive fields
function removeSensitiveUserfields(_, res, next) {
  res.locals.matchingUser = Object.assign({}, res.locals.matchingUser);

  // Delete everything we dont need
  delete res.locals.matchingUser.hash;
  delete res.locals.matchingUser._id;
  delete res.locals.matchingUser.isAdmin;
  next();
}

//Merges req.body fields sent from frontend with local user object
//Updates user in database with the new fields
function updateUserfields(req, res, next) {
  const updater = (existingUser, update) => {
    var output = {};
    Object.keys(existingUser).forEach((key) => {
      if (existingUser[key] instanceof Object) {
        output[key] = Object.assign({}, existingUser[key], update[key]);
      } else {
        if (update[key]) {
          output[key] = update[key];
        } else {
          output[key] = existingUser[key];
        }
      }
    });
    return output;
  };
  res.locals.matchingUser = updater(res.locals.matchingUser, req.body);

  var index = users.findIndex(
    (user) => user._id === res.locals.matchingUser._id
  );
  users[index] = res.locals.matchingUser;
  next();
}

module.exports = router;
