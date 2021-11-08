var router = require("express").Router();

userRouter = require("./user");
loginRouter = require("./login");
logoutRouter = require("./logout");
signupRouter = require("./signup");
passwordRouter = require("./password");
searchRouter = require("./search");

router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/signup", signupRouter);
router.use("/password", passwordRouter);
router.use("/search", searchRouter);
router.use("/", userRouter);

module.exports = router;
