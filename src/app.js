const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express()

app.use(cors({
    origin:process.env.FRONTEND_URI,
    credentials:true,
}))

app.use(express.json({limit:"20kb"}));  //to handle json data
app.use(express.urlencoded({extended:true}));   //to handle data coming from url , api headers %
app.use(cookieParser());


const userRoutes = require("./routes/user.routes");

app.use("/api/v1/user",userRoutes);

module.exports = app;