require("dotenv").config();

//HTTP host, port and protocol for app
PROTOCOL = "http://";
HTTPPORT = process.env.HTTPPORT ? process.env.HTTPPORT : 8080;
if (process.env.HTTPS == "true") {
  PROTOCOL = "https://";
  HTTPPORT = process.env.HTTPSPORT;
}
HOST = process.env.HOST ? process.env.HOST : "localhost";

//SMTP host, port and credentials for sending emails
SMTPHOST = process.env.SMTPHOST ? process.env.SMTPHOST : "";
SMTPPORT = process.env.SMTPPORT ? process.env.SMTPPORT : 465;
SMTPUSER = process.env.SMTPUSER ? process.env.SMTPUSER : "";
SMTPPASS = process.env.SMTPPASS ? process.env.SMTPPASS : "";

//Applies defaults for environment variables where applicable
//Allows for reuse throughout the application
module.exports = {
  PROTOCOL,
  HTTPPORT,
  HOST,
  SMTPHOST,
  SMTPPORT,
  SMTPUSER,
  SMTPPASS,
};
