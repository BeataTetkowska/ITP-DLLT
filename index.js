require("dotenv").config();
const app = require("./app/app");

const log = require("./app/utils/winstonLogger");

const port = process.env.HTTPPORT || 8080;
app.listen(port, () => log.info(`Example app listening on port ${port}!`));
