const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");
const dotenv = require("dotenv").config();
const app = express();

const port = process.env.PORT;
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL).then(()=>{
    console.log("Db Connect....");
}).catch(err=>{
    console.log("Db not Connect...");
});
app.use(express.json());
app.use("/user",userRouter);

app.get("/",(req,resp)=>{
    resp.json("Hello");
})

app.listen(port,()=>{
    console.log(`Server runing on port http://localhost:${port}`);
});