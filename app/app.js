const express = require("express");
const app = express();

const logger = require("./middleware/logger");

//Logging with winston used as middleware to log all requests made to backend
app.use(logger);

app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
