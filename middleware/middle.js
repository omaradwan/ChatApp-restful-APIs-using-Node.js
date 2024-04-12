
const jwt=require("jsonwebtoken")
const getID=(token)=>{

    const SECRET_KEY = process.env.SECRET_KEY
  
    try{
        const curuser = jwt.verify(token,SECRET_KEY);
        return curuser.id;
    }
    catch (err) {
        throw err
    }
}
module.exports={
    getID
}