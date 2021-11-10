const { HTTPPORT } = require("./app/utils/dotenvDefaults");
const app = require("./app/app");
const log = require("./app/utils/winstonLogger");
const mongoose = require("mongoose");

var uri = "mongodb://127.0.0.1:27017/dllt";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;
log.debug("string");

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

app.listen(HTTPPORT, () =>
  log.info(`Example app listening on port ${HTTPPORT}!`)
);
