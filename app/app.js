const express = require("express");
const app = express();

const logger = require("./middleware/logger");
const eventRouter = require("./routes/event");

//Logging with winston used as middleware to log all requests made to backend
app.use(logger);

app.use("/event", eventRouter);

app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
