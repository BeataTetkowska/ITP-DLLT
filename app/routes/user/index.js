var router = require("express").Router();
const userIs = require("../../middleware/userIs");

const userRouter = require("./user");
const loginRouter = require("./login");
const logoutRouter = require("./logout");
const signupRouter = require("./signup");
const deleteUser = require("./deleteUser");
const passwordRouter = require("./password");
const searchRouter = require("./search");

router.use("/", userRouter);
// DELETE /user -> deletes logged in user
router.delete("/", userIs.loggedIn, deleteUser);
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/signup", signupRouter);
router.use("/password", passwordRouter);
router.use("/search", searchRouter);

module.exports = router;
