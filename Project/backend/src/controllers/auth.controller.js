const userModel=require("../models/user.model");
const jwt=require("jsonwebtoken");
require("dotenv").config();
const bcrypt=require("bcryptjs");

//REGISTER
const registerUser=async(req,res)=>{
    const {username,email,password,role}=req.body;
    const isUserExist=await userModel.findOne({
        $or:[{email:email},{username:username}],
    })
    if(isUserExist){
        return res.status(409).json({
            "message":"User already exists"
        })
    };
    
    try{
        const hash=await bcrypt.hash(password,10);

        const user=await userModel.create({
            username:username,
            email:email,
            password:hash,
            role:role
        });
        const token=jwt.sign({
            id:user._id,
            role:user.role
        },process.env.JWT_SECRET);
        
        res.cookie("token",token);

        res.status(201).json({
            "message":"User registered successfully",
            user:{
                username:user.username,
                email:user.email,
                role:user.role
            },
            token:token});
    }catch(err){
        return res.status(500).json({
            "message":"Internal server error"
        });
    }
}

const loginUser=async(req,res)=>{

    const {username,email,password}=req.body;
    const user=await userModel.findOne({
        $or:[{email:email},{username:username}]
    })
    if(!user){
        return res.status(404).json({
            "message":"Invalid credentials"
        });
    }
    try{
        const isPasswordValid=await bcrypt.compare(password,user.password);
        
        if(!isPasswordValid){
            return res.status(401).json({
                "message":"Invalid credentials"
            })
        }

        const token=jwt.sign({
            id:user._id,
            role:user.role
        },process.env.JWT_SECRET);

        res.cookie("token",token);
        res.status(200).json({
            "message":"Login successful",
        })

    }catch(err){
        return res.status(500).json({
            "message":"Internal server error"
        })
    }
}

async function logoutUser(req,res){
    res.clearCookie("token");

}

module.exports={registerUser,loginUser,logoutUser};