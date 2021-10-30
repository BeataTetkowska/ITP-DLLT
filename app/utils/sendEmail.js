const {
  SMTPHOST,
  SMTPPORT,
  SMTPUSER,
  SMTPPASS,
} = require("../utils/dotenvDefaults");
const log = require("./winstonLogger");
const nodemailer = require("nodemailer");

//SMTP connection details for sending emails from .env file
const transporter = nodemailer.createTransport({
  host: SMTPHOST,
  port: SMTPPORT,
  secure: true,
  auth: {
    user: SMTPUSER,
    pass: SMTPPASS,
  },
});

// //TODO select html templating engine before html email can be sent
// async function sendHtmlEmail(
//   emailData,
//   ejsTemplate,
//   templateQueries,
//   attachments
// ) {
//   await ejs.renderFile(ejsTemplate, templateQueries, {}, async (_, str) => {
//     emailData.html = str;
//     if (attachments) {
//       emailData.attachments = attachments;
//     }
//     await transporter
//       .sendMail(emailData)
//       .then((info) => log.info(info.response));
//   });
// }

async function sendTextEmail(emailData, text, attachments) {
  emailData.text = text;
  if (attachments) {
    emailData.attachments = attachments;
  }
  await transporter.sendMail(emailData).then((info) => log.info(info.response));
}

module.exports = {
  sendTextEmail,
  //sendHtmlEmail,
};
