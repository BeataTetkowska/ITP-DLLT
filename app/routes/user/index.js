var router = require("express").Router();

const addRouter = require("./add");
const userRouter = require("./user");
const loginRouter = require("./login");
const logoutRouter = require("./logout");
const signupRouter = require("./signup");
const passwordRouter = require("./password");
const searchRouter = require("./search");

router.use("/add", addRouter);
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/signup", signupRouter);
router.use("/password", passwordRouter);
router.use("/search", searchRouter);
router.use("/", userRouter);

module.exports = router;
