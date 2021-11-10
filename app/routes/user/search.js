var router = require("express").Router();
var user = require("../../models/user");
const userIs = require("../../middleware/userIs");

// GET /user/search?query
// -> takes a string query
// -> returns a filtered list of the users table that matches the query
router.get("/", userIs.admin, filterUser);

async function filterUser(req, res) {
  var { query } = req.query;
  if (!query) query = "";
  query = query.toLowerCase();

  var filteredUsers = await user.find({
    name: { full: { $regex: new RegExp(query, "i") } },
  });
  console.log(filteredUsers);
  return res.json(filteredUsers);
  // return res.json(
  //   users
  //     .filter((user) =>
  //       `${user.name.first} ${user.name.last}`.toLowerCase().includes(query)
  //     )
  //     .slice(0, 5)
  // );
}

module.exports = router;
