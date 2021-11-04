const path = require("path");

const router = require("express").Router();

const users = require("../../db/users");
const userIs = require("../../middleware/userIs");;
//Profile
router.get("/", userIs.loggedIn, findUserById, removeSensitiveUserfields, (req, res) => {
    // If HTTP Accept header is text/html (which browsers always set) then the html: function will run
    // If HTTP Accept head is application/json (which $.getJSON will set for you) then the json: function will run 
 res.format({
    html: () => res.sendFile(path.join(__dirname, "../../views/user.html")),
    json: () => res.json(res.locals.matchingUser),
  });
});

router.patch(
  "/",
  findUserById,
  updateUserfields,
  removeSensitiveUserfields,
  (req, res) => {
    res.json(res.locals.matchingUser);
  }
);

function findUserById(req, res, next) {
  res.locals.matchingUser = Object.assign(
    {},
    users.find((user) => {
      if (user._id === req.user._id) {
        return true;
      }
    })
  );

  if (!res.locals.matchingUser._id) {
    console.log("user not found");
    res.send(404, "User not found");
    return;
  }
  next();
}

function removeSensitiveUserfields(req, res, next) {
  // Delete everything we dont need
  delete res.locals.matchingUser.hash;
  delete res.locals.matchingUser._id;
  delete res.locals.matchingUser.isAdmin;
  next();
}

function updateUserfields(req, res, next) {
  const updater = (existingUser, update) => {
    var output = {};
    Object.keys(existingUser).forEach((key) => {
      if (existingUser[key] instanceof Object) {
        console.log("Printing keys");
        console.log(existingUser[key], update[key]);
        output[key] = Object.assign({}, existingUser[key], update[key]);
      } else {
        if (update[key]) {
          console.log("Taking key from update", key);
          output[key] = update[key];
        } else {
          console.log("Taking key from existingUser", key);
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