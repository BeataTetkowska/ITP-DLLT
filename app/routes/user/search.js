var router = require("express").Router();
var users = require("../../db/users");
const userIs = require("../../middleware/userIs");

// GET /user/search?query
// -> takes a string query
// -> returns a filtered list of the users table that matches the query
router.get("/", userIs.admin, filterUser);

function filterUser(req, res) {
  var { query } = req.query;
  if (!query) query = "";
  query = query.toLowerCase();

  return res.json(
    users
      .filter((user) =>
        `${user.name.first} ${user.name.last}`.toLowerCase().includes(query)
      )
      .slice(0, 5)
  );
}

module.exports = router;
