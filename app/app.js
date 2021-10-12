const express = require("express");
const app = express();

const logger = require("./middleware/logger");
const eventRouter = require("./routes/event");

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
app.use(express.static("public"));
//Compress files before sending
app.use(compression());

//Routers
app.use("/event", eventRouter);

app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
