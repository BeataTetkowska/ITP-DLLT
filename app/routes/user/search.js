var router = require("express").Router();
var users = require("../../db/users");

const log = require("../../utils/winstonLogger");

// GET /user/search?query
// -> takes a string query
// -> returns a filtered list of the users table that matches the query
router.get("/", filterUser);

function filterUser(req, res) {
  var { query } = req.query;

  if (!query) {
    query = "";
  }

  var output = users.filter((user) => {
    if (user.name.first.includes(query)) {
      return true;
    } else if (user.name.last.includes(query)) {
      return true;
    } else if (user.email.includes(query)) {
      return true;
    }
    return false;
  });

  res.json({ query, output: output.slice(0, 5) });
}

module.exports = router;
