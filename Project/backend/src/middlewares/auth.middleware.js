const jwt=require("jsonwebtoken");
require("dotenv").config();

async function authArtist(req,res,next){
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({"message":"unauthorized"});
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.role!=="artist"){
            return res.status(403).json({"message":"you don't have access to this resource"});
        }

        req.user=decoded;

        next();

    }catch(err){
        console.log(err);
        return res.status(401).json({"message":"invalid token"});
    }
}

async function authUser(req,res,next){
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({
            "message":"unauthorized"
        });
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        if(decoded.role!=="user" && decoded.role!=="artist"){
            return res.status(403).json({
                "message":"you don't have access to this resource"
            })
        }
        
    }catch(err){
        return res.status(401).json({
            "message":"invalid token"
        })
    }

    next();
}

module.exports={authArtist,authUser};