var router = require("express").Router();

loginRouter = require("./login");
logoutRouter = require("./logout");
signupRouter = require("./signup");

router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/signup", signupRouter);

module.exports = router;
