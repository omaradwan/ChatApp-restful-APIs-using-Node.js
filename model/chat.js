const mongoose=require("mongoose");

const chatSchema=new mongoose.Schema({
    chatName:{
        type:String,
        trim:true,
    },
    isGroupChat:{ 
        type:Boolean,
        required:true,
        default:false,
    },
    users:[{type:String,ref:"User"}],
    admins:[{type:String,ref:"User"}],
    link:{
        type:String,
    },
    expiry:{
        type:Date
    }
},
{timestamps:true}
)

module.exports=mongoose.model("Chat",chatSchema);