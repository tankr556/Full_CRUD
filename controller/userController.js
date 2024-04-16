const App_Status = require("../constants/constants");
const userTable = require("../model/userSchema")
const bcryptjs = require("bcryptjs");
const JWT = require("jsonwebtoken");
const mongoose = require('mongoose');




const userRegister = async (req, resp) => {
    try {
        const { name, email, password } = req.body
        const checkname = await userTable.findOne({ name: name });
        if (checkname) {
            return resp.status(401).json({
                status: App_Status.FAIELD,
                message: "name is already exites",
                data: null
            })
        }
        const checkemail = await userTable.findOne({ email: email })
        if (checkemail) {
            return resp.status(401).json({
                status: App_Status.FAIELD,
                message: "Email is already exites",
                data: null
            })
        }
        const hashpassword = await bcryptjs.hash(password, 10);
        let theUserObj = {
            name: name,
            email: email,
            password: hashpassword
        }
        theUserObj = await userTable(theUserObj).save()

        return resp.status(200).json({
            Status: App_Status.SUCCESS,
            message: "User Register Sucessfully",
            data: theUserObj
        })
    } catch (error) {
        return resp.status(500).json({
            Status: App_Status.FAIELD,
            message: "Interval Server error",
            data: null
        })
    }
}

const userLogin = async(req,resp)=>{
    try {
        let {email,password} = req.body
        let theUserObj = await userTable.findOne({email:email});
        if (!theUserObj) {
            return resp.status(401).json({
                status : App_Status.FAIELD,
                message : "Invalid Email"
            })
        }
        let ismatch = await bcryptjs.compare(password,theUserObj.password);
        if (!ismatch) {
           return resp.status(401).json({
                status : App_Status.FAIELD,
                message : "Invalid Password"
           }) 
        }
        let payload = {
            id : theUserObj._id,
            email : theUserObj.email,
            password : theUserObj.password
        }
        let secretkey = process.env.JWT_SECRET_KEY

        if (payload && secretkey) {
            let token = JWT.sign(payload,secretkey,{expiresIn : "1h"})
            return resp.status(200).json({
                status : App_Status.SUCCESS,
                message : "Login Successfully",
                data : theUserObj,
                token : token
            })
        }
    } catch (error) {
        return resp.status(500).json({
            status : App_Status.FAIELD,
            message : "Interval Server error",
            data : null
        }) 
    }
}

const userList = async (req,resp)=>{
    try{
        const userList = await userTable.find();
        if(userList){
            return resp.status(200).json({
                status : App_Status.SUCCESS,
                message : "User List Successfully",
                data : userList
            })
        }
    }
    catch(error){
        return resp.status(500).json({
            status : App_Status.FAIELD,
            message : "Interval Server Error",
            data : null
        })
    }
}

const userListId = async (req,resp)=>{
    try{
        let {_id} = req.params;
        const userId = await userTable.findById({_id : _id});
        if(!userId){
            return resp.Status(401).json({
                status : App_Status.FAIELD,
                message : "user not found",
                data : null
            })
        }
        resp.status(200).json({
            status : App_Status.SUCCESS,
            message : "User Get Successfully",
            data : userId
        })
    }
    catch(error){
        return resp.status(500).json({
            status: App_Status.FAIELD,
            message : "Interval server Error",
            data : null
        })
    }
}


const userDeleted = async (req, resp) => {
    try {
        const { _id } = req.params;
        const userListId = await userTable.findById(_id);
        if (!userListId) {
            return resp.status(404).json({
                status: App_Status.FAILED,
                message: "User not found",
                data: null
            });
        }

        const userIdDeleted = await userTable.findByIdAndDelete(userListId);
        resp.status(200).json({
            status: App_Status.SUCCESS,
            message: "User deleted successfully",
            data: userIdDeleted
        });
    } catch (error) {
        return resp.status(500).json({
            status: App_Status.FAILED,
            message: "Internal server error",
            data: null
        });
    }
};

const userUpdated = async(req,resp)=>{
    try{
        let {_id}= req.params;
        let {name,email}= req.body;
        const userId = await userTable.findById(_id);
        if(!userId){
            return resp.status(401).json({
                status: App_Status.FAIELD,
                message : "user not Found",
                data : null
            })
        }
        let theUserObj ={
            name : name,
            email : email
        }
        theUserObj = await userTable.findByIdAndUpdate(userId,theUserObj,{new:true})
        return resp.status(200).json({
            status : App_Status.SUCCESS,
            message : "User updated successfully",
            data : theUserObj
        })
    }
    catch(error){
        return resp.status(500).json({
            status : App_Status.FAIELD,
            message : "Interver server error",
            data : null
        })
    }
}






module.exports = {
    userRegister,
    userLogin,
    userList,
    userListId,
    userDeleted,
    userUpdated
}