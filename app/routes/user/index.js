var router = require("express").Router();
const userIs = require("../../middleware/userIs");

const loginRouter = require("./login");
const logoutRouter = require("./logout");
const signupRouter = require("./signup");
const deleteUser = require("./deleteUser");

// DELETE /user -> deletes logged in user
router.delete("/", userIs.loggedIn, deleteUser);
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/signup", signupRouter);

module.exports = router;
