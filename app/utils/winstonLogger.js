const { createLogger, format, transports } = require("winston");

const log = createLogger({
  level: "http",
  format: format.combine(format.errors({ stack: true })),
  transports: [
    new transports.File({
      filename: "./logs/server.log",
      format: format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.json()
      ),
    }),
  ],
});

const logFormat = format.printf(function (info) {
  return `${info.level}: ${JSON.stringify(info.message, null, 4)}`;
});

if (process.env.NODE_ENV !== "production") {
  log.add(
    new transports.Console({
      level: "debug",
      format: format.combine(format.colorize(), logFormat),
    })
  );
}

module.exports = log;
