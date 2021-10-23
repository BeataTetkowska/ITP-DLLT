require("dotenv").config();
const app = require("./app/app");
const mongoose = require("mongoose");

const generateMongoUri = require("./app/utils/generateMongoUri");
const log = require("./app/utils/winstonLogger");

var uri = generateMongoUri();
log.info(`Connecting to Mongo with ${uri}`);
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function () {
  log.info("MongoDB database connection established successfully");
});

const port = process.env.HTTPPORT || 8080;
app.listen(port, () => log.info(`Example app listening on port ${port}!`));
