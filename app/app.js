const path = require("path");

const eventRouter = require("./routes/event");
const userRouter = require("./routes/user");

//Prepare appliation with middleware
const getAppWithMiddleware = require("./middleware");
const app = getAppWithMiddleware();

//Routers
app.use("/session", eventRouter);
app.use("/user", userRouter);

// GET / -> sends event list
// I think this will work as the homepage for now
app.get("/", (req, res) => {
  var file = "eventList.html";
  if (req.user && req.user.isAdmin) file = "adminEventList.html";
  res.sendFile(path.join(__dirname, `./views/${file}`));
});

module.exports = app;
