const { HTTPPORT } = require("./app/utils/dotenvDefaults");
const app = require("./app/app");

const log = require("./app/utils/winstonLogger");

app.listen(HTTPPORT, () =>
  log.info(`Example app listening on port ${HTTPPORT}!`)
);
