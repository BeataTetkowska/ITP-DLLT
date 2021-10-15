const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const logger = require("./middleware/logger");
const eventRouter = require("./routes/event");

const app = express();

//Middleware
//Logging with winston used as middleware to log all requests made to backend
app.use(logger);
//HTTP body parse for handling post requests
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//HTTP body parser for json post requests
app.use(bodyParser.json());
//Cookie parser
app.use(cookieParser());
//Public folder for images, css and js files
app.use(express.static(path.join(__dirname, "public")));
//Compress files before sending
app.use(compression());

app.set("views", path.join(__dirname, "views"));

//Routers
app.use("/event", eventRouter.view);
app.use("/api/event", eventRouter.api);

app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
