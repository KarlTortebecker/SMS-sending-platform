const express = require('express') 
const app = express()

const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require("./lib/middlewares/cors")
const handleError = require("./lib/middlewares/error")

const authRoute = require("./lib/routes/authRoutes")
const userRoute = require("./lib/routes/userRoutes")
const contactRoute = require("./lib/routes/contactRoutes")
const messageRoute = require("./lib/routes/messageRoutes")
const conversationRoute = require("./lib/routes/conversationRoutes")


// middlewares 
app.use(bodyParser.json())
app.use(cors)
app.use(cookieParser())
app.use(passport.initialize())


// routes
app.use("/api/v0/auth", authRoute)
app.use("/api/v0/users", userRoute)
app.use("/api/v0/contacts", contactRoute)
app.use("/api/v0/messages", messageRoute)
app.use("/api/v0/conversations", conversationRoute)

app.use("", (req, res) =>{
    res.send("hello world")
})

// middlewares 
app.use(handleError)

 
module.exports = app