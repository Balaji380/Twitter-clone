import { Mongoose } from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";



export const signup=async(req,res)=>{
    try {

        const {userName,fullName,email,password}=req.body;

        const emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/


        if(!emailRegex.test(email)){
           return res.status(400).json("Invalid Email")
        }

        const existsUser=await  User.findOne({userName})
        const existsEmail=await  User.findOne({email})

        if(existsUser || existsEmail){
            return res.status(400).json("Already UserName or Email Exists")

        }


        if(password.length<6){
            return res.status(400).json("Password length must be greater than 6")
        }

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const newUser=new User({
            userName,
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res)
           await newUser.save()
           res.status(200).json({
              _id:newUser._id,
              userName:newUser.userName,
              fullName:newUser.fullName,
              email:newUser.email,
              followers:newUser.followers,
              following:newUser.following,
              profileImg:newUser.profileImg,
              coverImg:newUser.coverImg,
              bio:newUser.bio,
              link:newUser.link
           })
        }

        else{
            res.status(400).json("Invalid User")
        }
        
    } catch (error) {
        console.log("signup controller error")
        res.status(500).json("Invalid server error")
    }
}


export const login=async(req,res)=>{
         try {
            const {userName,password}=req.body;
            const user=await User.findOne({userName})
            const isPasswordCorrect=await bcrypt.compare(password,user?.password|| "")

            if(!user || !isPasswordCorrect){
                 return res.status(400).json("Username or Password are not Matched")
            }

            generateToken(user._id,res)

            res.status(200).json({
              _id:user._id,
              userName:user.userName,
              fullName:user.fullName,
              email:user.email,
              followers:user.followers,
              following:user.following,
              profileImg:user.profileImg,
              coverImg:user.coverImg,
              bio:user.bio,
              link:user.link
           })

         } catch (error) {
            console.log(`Login controller:${error}`)
            return  res.status(500).json("Internal Server Error")
         }
}

export const logout=(req,res)=>{
        try {
            res.cookie("jwt","",{maxAge:0})
            res.status(200).json("Logout successfully")
        } catch (error) {
            console.log(`Logout controller:${error}`)
            return res.status(500).json("Internal server Error")
        }
}


export const getMe=async(req,res)=>{
    try {
        const user= await User.findOne({_id:req.user.id}).select("-password")
        res.status(200).json(user)
    } catch (error) {
        console.log(`Error in getMe controller:${error}`)
        res.status(400).json("Internal Server Error")
    }
}

