const jwt=require("jsonwebtoken");
const asyncHandler=require("async-handler");
const { use } = require("../routes/auth");
const generateToken = async (userID) => {
    const secretKey = process.env.SECRET_KEY
    // Create a token with the user's ID
    const token = await jwt.sign( userID , secretKey, { expiresIn: '2h' });
  
    return token;
};
module.exports={
    generateToken
}