const eventRouter = require("./routes/event");
const userRouter = require("./routes/user");

//Prepare appliation with middleware
const getAppWithMiddleware = require("./middleware");
const app = getAppWithMiddleware();

//Routers
app.use("/session", eventRouter);
app.use("/user", userRouter);

//Example test route
app.get("/", (_, res) => res.send("Hello World!"));

module.exports = app;
