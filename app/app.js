const eventRouter = require("./routes/event");
const userRouter = require("./routes/user");

const users = require("./db/users");
const userIs = require("./middleware/userIs");

//Prepare appliation with middleware
const getAppWithMiddleware = require("./middleware");
const app = getAppWithMiddleware();

//Routers
app.use("/event", eventRouter);
app.use("/user", userRouter);

//Profile
app.get("/profile", findUserById, removeSensitiveUserfields, (req, res) => {
  res.format({
    html: () => {
      //   res.send("This is html");
      res.json(res.locals.matchingUser);
    },
    json: () => res.json(res.locals.matchingUser),
  });
});

app.patch(
  "/profile",
  findUserById,
  updateUserfields,
  removeSensitiveUserfields,
  (req, res) => {
    res.json(res.locals.matchingUser);
  }
);

app.get("/", (req, res) => res.send("Hello World!"));

function findUserById(req, res, next) {
  res.locals.matchingUser = Object.assign(
    {},
    users.find((user) => {
      if (user._id === 1) {
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

module.exports = app;
