const asyncHandler=require("express-async-handler")
const { check, validationResult } = require('express-validator');
const bcrypt=require("bcrypt");
const User=require("../model/user");
const { generateToken } = require("../util/generateToken");
const {sendConfirmationEmail}=require("../middleware/confirmationEmail")

const register=asyncHandler(async(req,res,next)=>{
   
     let errors=validationResult(req);

     if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {name,email,password,confirmPassword}=req.body;

    if(password!=confirmPassword){
        return res.status(400).json("password do not match");
    }
    const hashedPass= await bcrypt.hash(password,10)
   
    const newUser=new User({
        name,
        email,
        password:hashedPass ,
        confirmPassword:hashedPass,
    })
    
    const retToken=await generateToken({id:newUser._id});
    newUser.Token=retToken;
    const isSaved=await newUser.save();
    if(!isSaved){
        throw new Error("cannot signed up")
    }
    sendConfirmationEmail(email)
    return res.status(200).json(isSaved);
})

const edit=asyncHandler(async(req,res,next)=>{
    const curUser=req.current.id;

    const updateObj = {
        ...(req.body && { name: req.body.name, email: req.body.email }),
        ...(req.file && { avatar: req.current.id })
    };
    let encryptedPass;
    if(req.body.password){
        encryptedPass=await bcrypt.hash(req.body.password,10);
        updateObj.password=encryptedPass;
        updateObj.confirmPassword=encryptedPass
    }
    

    const user=await User.findOneAndUpdate(
        {
            _id:curUser
        },
        updateObj,
        {
         new:true
        }
    )
    if(!user){
        throw new Error("Not found user");
    }
    const isSaved=await user.save();
    if(!isSaved){
        throw new Error("Error while editing")
    }
    return res.status(200).json({msg:"edited successfully",user:isSaved})
})


const login=asyncHandler(async(req,res,next)=>{
    console.log(req.body)
   const {email,password}=req.body;
  
   const user=await User.findOne({email:email});
   if(!user){
    return res.status(401).json({msg:"email is not correct"})
   }
   const check=await bcrypt.compare(password,user.password)

   if(!check){
    return res.status(401).json({msg:"password is not correct"})
   // throw new Error("wron password")
   }
   const retToken=await generateToken({id:user._id});
   user.Token=retToken

   const isSaved=await user.save();
   return res.status(200).json(isSaved)
})

module.exports={
    register,
    login,
    edit
}