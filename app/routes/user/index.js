var router = require("express").Router();

loginRouter = require("./login");
logoutRouter = require("./logout");
signupRouter = require("./signup");
searchRouter = require("./search");

router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/signup", signupRouter);
router.use("/search", searchRouter);

module.exports = router;
