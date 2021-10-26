const eventRouter = require("./routes/event");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");

//Prepare appliation with middleware
const getAppWithMiddleware = require("./middleware");
const app = getAppWithMiddleware();

//Routers
app.use("/event", eventRouter.view);
app.use("/api/event", eventRouter.api);
app.use("/admin/event", eventRouter.adminView);
app.use("/api/admin/event", eventRouter.adminApi);

app.use("/signup", signupRouter);
app.use("/login", loginRouter);

app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
