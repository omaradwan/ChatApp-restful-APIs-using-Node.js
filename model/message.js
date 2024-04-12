const mongoose=require("mongoose");

const messageSchema=new mongoose.Schema({
   content:{
      type:String,
      trim:true
   },
   sender:{
      type:String,ref:"User"
   },
   chatInfo:{
      type:String,ref:"Chat"
   }, 
   readBy:[{type:String,ref:"User"}]
},
{timestamps:true} 

)

module.exports=mongoose.model("Message",messageSchema);