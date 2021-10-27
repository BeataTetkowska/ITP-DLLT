const eventRouter = require("./routes/event");
const userRouter = require("./routes/user");

const users = require("./db/users");
const userIs = require("./middleware/userIs");

//Prepare appliation with middleware
const getAppWithMiddleware = require("./middleware");
const app = getAppWithMiddleware();

//Routers
app.use("/event", eventRouter);
app.use("/user", userRouter);


app.get("/profile", userIs.loggedIn,  (req, res) =>{
    var matchingUser = users.filter(user =>{
        if(user._id===req.user._id){
            return true
        }
    })


    matchingUser = Object.assign({}, matchingUser)
    matchingUser = {
        email: matchingUser.email,
        name: matchingUser.name,
        postcode: matchingUser.postcode,
        dob:matchingUser.dob,
        emergency:matchingUser.emergency,
    }
  
    console.log(req.user)
    res.json(matchingUser)
})

app.patch("/profile", (req, res) =>{
    res.send("Hello from profile patch")
})

app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
