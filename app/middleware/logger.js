const log = require("../utils/winstonLogger");

module.exports = (req, res, next) => {
  log.http({
    req: {
      headers: {
        cookie: req.cookies,
        sessionId: req.sessionID,
      },
      method: req.method,
      sessionId: req.sessionId,
      originalUrl: req.originalUrl,
      query: req.query,
    },
  });
  next();
};
