const eventRouter = require("./routes/event");
const userRouter = require("./routes/user");

//Prepare appliation with middleware
const getAppWithMiddleware = require("./middleware");
const app = getAppWithMiddleware();

//Routers
app.use("/event", eventRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
