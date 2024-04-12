const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
      
    },
    confirmPassword:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"/uploads/profile.jpg"
    },
    Token:{
        type:String
    }
},
{timestamps:true}
)

module.exports=mongoose.model("User",userSchema);