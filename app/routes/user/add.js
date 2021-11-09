const path = require("path");
var router = require("express").Router();

const userIs = require("../../middleware/userIs");

router.get("/", userIs.admin, (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/addUser.html"));
});

module.exports = router;
