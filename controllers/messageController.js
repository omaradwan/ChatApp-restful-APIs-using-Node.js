const asyncHandler=require("express-async-handler")
const Msg=require("../model/message")
const Chat=require("../model/chat");
const { check } = require("express-validator");
const socket=require("../util/socket_init")

const addMessage=asyncHandler(async(req,res,next)=>{    
    const{chatID,senderID,msg}=req.body;

    if(!msg){
        return res.status(400).json({msg:"msg is empty"})
    }
    if(!senderID||!chatID){
        return res.status(400).json("senderID and chatID are required");
    }
    
    const chat=await Chat.findOne({_id:chatID});
    if(!chat){
        throw new Error("chat not found")
    }
    if(!chat.users.includes(senderID)){
        return res.status(200).json({msg:"user has no authentication to send msg in this chat"})
    }
    const newMsg=new Msg({
        content:msg,
        sender:senderID,
        chatInfo:chatID,
    })
    let io=socket.getIO();
    chat.users.forEach(id => {
        if(id.toString()==senderID) {
           // console.log(id.toString());
            return;
        }
        const socketID=io.idTosocket.get(id.toString());
        console.log(socketID)
        if(socketID){
            io.to(socketID).emit("recieve-msg",msg);
        }
    });


    const checkMsg=await newMsg.save();
    
    if(!checkMsg){
        throw new Error("error while creating msg");
    }
    return res.status(201).json({msg:checkMsg});

})

const getMsg=asyncHandler(async(req,res,next)=>{
    const{chatID}=req.body;

    const chat=await Chat.findOne({_id:chatID});
    if(!chat){
        throw new Error("No chat found");
    }
    const msgs=await Msg.find(
        {
            chatInfo:chatID
        }
    )
    if(!msgs){
        return res.status(200).json({msg:"No msgs yet"});
    }
    const curID=req.current.id
    const filteredMsgs=msgs.filter(msg=>!msg.readBy.includes(curID))
    const updatedReadby=filteredMsgs.map(it=>{
        it.readBy.push(curID)
        it.save();
});
    
    if(!updatedReadby){ 
        throw new Error("Error while updating readBy array");
     }
    return res.status(200).json({msg:"Done successfully"});
})

const readby=asyncHandler(async(req,res,next)=>{
    const{msgID,chatID}=req.body;
    const curUser=req.current.id;
    const chat=await Chat.findOne({_id:chatID});
    if(!chat){
        throw new Error("No chat found");
    }
    if(!chat.users.includes(curUser)){
        return res.status(401).json({msg:"this user is not in this group chat"})
    }
    const msg=await Msg.findOne({_id:msgID,chatInfo:chatID}).populate("readBy");
    if(!msg){
        throw new Error("Error while finding message");
    }
    if(msg.sender!=curUser){
        return res.status(401).json({msg:"unauthorized access->the current user not the one who send the msg"})
    }
   
    console.log(msg);
    return res.status(200).json({readBy:msg.readBy});
})

module.exports={
    addMessage,
    getMsg,
    readby
}