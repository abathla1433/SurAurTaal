const express=require("express");
const  router=express.Router();
const authController=require("../controllers/auth.controller");

//REGISTER
router.post("/register",authController.registerUser);

//LOGIN
router.post("/login",authController.loginUser);

//LOGOUT
router.post("/logout",authController.logoutUser);

module.exports=router;