const express = require("express");
const { userRegister, userLogin, userList, userListId, userDeleted, userUpdated } = require("../controller/userController");

const userRouter = express.Router();

userRouter.post("/register",async(req,resp)=>{
    await userRegister(req,resp);
})

userRouter.post("/login",async(req,resp)=>{
    await userLogin(req,resp);
})

userRouter.get("/list",async(req,resp)=>{
    await userList(req,resp);
})

userRouter.get("/userlist/:_id",async(req,resp)=>{
    await userListId(req,resp);
})

userRouter.delete("/userdelete/:_id", async (req, resp) => {
    await userDeleted(req, resp);
});

userRouter.put("/userupdate/:_id", async (req, resp) => {
    await userUpdated(req, resp);
});

module.exports = userRouter;