const express=require("express");
const mongoose=require("mongoose");
const {verifyToken}=require("./middleware/verifyToken")
const path = require('path');
const multer=require("multer")
const io=require("./util/socket_init")

const app=express();
require('dotenv').config();
app.use(express.json());

const userRoutes=require("./routes/auth");
const chatRoutes=require("./routes/chat")
const messageRoutes=require("./routes/message")

const url=process.env.MONGO_URL
const port=process.env.PORT


mongoose.connect(url)
.then(r=>{
    console.log("connected to db");
})
.catch(()=>{
  console.log("rrrr")
})


app.use(chatRoutes)
app.use("/api/msg",messageRoutes)
app.use("/api/auth",userRoutes)


// Global error handler
app.use((err, req, res, next) => {
 // console.error("An error occurred:", err.message);
  // Optionally, you can also send an error response to the client
  res.status(500).send(err.message);
});

const server=app.listen(port)
io.initSocket(server);
io.getIO().on("connection",io.Connection)