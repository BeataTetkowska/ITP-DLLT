var router = require("express").Router();

loginRouter = require("./login");
logoutRouter = require("./logout");
signupRouter = require("./signup");
passwordRouter = require("./password");

router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/signup", signupRouter);
router.use("/password", passwordRouter);

module.exports = router;
