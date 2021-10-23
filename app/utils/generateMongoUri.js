require("dotenv").config();

const log = require("./winstonLogger");

module.exports = () => {
  var defaults = {
    host: "localhost",
    port: "27017",
    db: "dllt",
    authSource: "",
  };

  var host = process.env.MONGOHOST ? process.env.MONGOHOST : defaults.host;
  var port = process.env.MONGOPORT ? process.env.MONGOPORT : defaults.port;
  var db = process.env.MONGODATABASE ? process.env.MONGODATABASE : defaults.db;

  var user = process.env.MONGOUSER;
  var pass = process.env.MONGOPASSWORD;
  var authSource = process.env.MONGOAUTHDB
    ? `?authSource=${process.env.MONGOAUTHDB}`
    : defaults.authSource;

  var uri;

  if (!user || !pass || !authSource) {
    log.warn(
      "Missing Environment variables for Mongo Authentication - Attempting to connect without authentication"
    );
    uri = `mongodb://${host}:${port}/${db}`;
  } else {
    log.debug(
      `All variables provided for authenticated mongodb connection - Attempting connection with user ${user}`
    );
    var uri = `mongodb://${user}:${pass}@${host}:${port}/${authSource}`;
  }

  return uri;
};
