const asyncHandler=require("express-async-handler")
const Chat=require("../model/chat");
const { use } = require("../routes/auth");
const uuid=require("uuid")

const chat=asyncHandler(async(req,res,next)=>{
    const {chatName,isGroupChat,users,admins}=req.body;
    if(!admins&&isGroupChat=='true'){
        return res.status(400).json({msg:"must specify an admin for this group chat"})
    }
    const curUser=req.current.id;
    if(isGroupChat&&!admins.includes(curUser)){
        throw new Error("Error")
    }
    if(isGroupChat=="true"){
         if(!chatName){
            return res.status(400).json({msg:"group name is required"})
         }
         if(users.length<2||!admins){
            return res.status(400).json({msg:"members should be more than 2 && admin of the chat is required"});
         }
    }

    if(users.length<2){
        return res.status(400).json("More than 2 members are required");
    }
      if(isGroupChat=='false'){
        const found=await Chat.findOne(
            {
                users:{$in:users}
            });
     
        if(found){
            return res.status(400).json({msg:"there is already a private chat between these two users"})
        }
      }
      

       const newChat= new Chat({
        chatName,
        isGroupChat,
        users,
        admins
       })
       
       if(isGroupChat==true){
        console.log(req.current.id)
        newChat.admins.push(req.current.id);
       }
       const checkChat=await newChat.save();
       if(!checkChat){
        return next(new Error("Error while creating new chat"))
       }
       return res.status(201).json("chat has been added successfully");
})

const fetchChat=asyncHandler(async(req,res,next)=>{
 
    const userId=req.current.id

    const chats=await Chat.find(
        {
            users:{$in:userId}
        }
    ).populate("users")
   
   
    if(!chats){
        return res.status(200).json("the user have no chats");
    }
    else{
        const chatDetails =  chats.map(chat => {
            if (chat.isGroupChat) {
                // For group chats, return chat name and users
                return {
                    chatName: chat.chatName,
                    users: chat.users.map(user => ({ name: user.name, id: user._id }))
                };
            } else {
                // For private chats, return user name and id
                
                    if(userId==chat.users[1]._id){
                        return{
                            userName: chat.users[0].name, 
                            userId: chat.users[0]._id
                        }
                    }
                    else{
                        return{
                            userName: chat.users[1].name,
                            userId: chat.users[1]._id
                        }
                    }
                }
        });
        return res.status(200).json(chatDetails)
    }
})


// add users in group chat and check if the admin is the one who add them or not
const addUser=asyncHandler(async(req,res,next)=>{
     const {userID,chatID,link}=req.body
    if(!link){
    const chats=await Chat.findOne({_id:chatID});
  
    if(chats){
        if(!chats.admins.includes(req.current.id)){
            return res.status(400).json("not valid ->  not admin")
        }
        const newUserIds = userID.filter(id => !chats.users.includes(id));
        
        if(newUserIds.length==0){
            return res.status(200).json("all users are currently in the group")
        }
    
        const updateUsers=await Chat.updateOne(
            {
                _id:chatID 
            },
            {
                $push:{users:newUserIds}
            },
            {
                new:true
            }
        )
        
        return res.status(201).json(updateUsers)
        }
        else{
            return res.status(400).json("no chat found")
        }
    } 
    else{
        const chat=await Chat.findOne({link:link});
        if(!chat){
            throw new Error("No chat found")
        }
        
        const currentDate=new Date();
        if(currentDate>chat.expiry){
            return res.status(401).json({msg:"the link has been expired"});
        }
        
            
        if(chat.users.includes(userID)){
            return res.status(200).json("user is already in chat")
        }
        chat.users.push(userID);
        await chat.save();
        return res.status(201).json({msg:"user added successfully"})

    }
})

const removeUser=asyncHandler(async(req,res,next)=>{
    const {userID,chatID}=req.body
    
    const chat=await Chat.findOne({_id:chatID});
    if(!chat){
        throw new Error("No chat found");
    }
    console.log(userID)
    if(!chat.admins.includes(req.current.id)){
        return res.status(400).json("not valid ->  not admin")
    }
   
    const updatedUsers=await Chat.findOneAndUpdate(
        {
            _id:chatID,
            users: {$in: userID}
        },
        { $pull: { users: {$in: userID}, admins:{$in:userID} } },
        {
           new:true
        }
    )
    if(!updatedUsers){
        return res.status(401).json({msg:"users not found in the chat or the chat not found"})
    }
    const checkUpdate=await updatedUsers.save();
    
    if(!checkUpdate){
        throw new Error("Error while removing user")
    }
    return res.status(200).json({msg:"the user has been removed"})
})

const rename=asyncHandler(async(req,res,next)=>{
    const {chatID,name}=req.body;
    const curUser=req.current.id;
    const chat=await Chat.findOneAndUpdate(
        {
            _id:chatID
        },
        { $set: { chatName: name } },
        {
            new:true
        }
    )
    if(!chat){
        throw new Error("No chat found");
    }
    if(!chat.users.includes(curUser)){
        throw new Error("unauthorized as the user not in this group chat")
    }
    let updatedChatName=await chat.save();
    if(!updatedChatName){
        throw new Error("error while changing name")
    }
    
    return res.status(201).json({msg:"name change successfully"})
})

const addAdmin=asyncHandler(async(req,res,next)=>{
    const{chatID,userID}=req.body;
    const chat=await Chat.findOne({_id:chatID});
    if(!chat){
        throw new Error("No chat found");
    }
    if(!chat.admins.includes(req.current.id)){
        return res.status(401).json({msg:"unauthorized member as he is not an admin"})
    }
    if(!chat.users.includes(userID)){
        return res.status(400).json({msg:"user not in the group"})
    }
    if(chat.admins.includes(userID)){
        return res.status(200).json({msg:"the user is already an admin"});
    }
    chat.admins.push(userID);
    const checkUpdate=await chat.save();
    if(!checkUpdate){
        throw new Error("Error while adding admin");
    }
    return res.status(200).json({msg:"user is added as an admin successfully"});
})

const ceateLink=asyncHandler(async(req,res,next)=>{
    const{chatID}=req.body;
    const curUser=req.current.id;

    const chat=await Chat.findOne({_id:chatID});
    if(!chat){
        throw new Error("No chat found");
    }
    if(!chat.isGroupChat){
        return res.status(400).json({msg:"this not a group chat"})
    }
    if(!chat.admins.includes(curUser)){
        return res.status(401).json({msg:"unauthorized Only admins can create link of gp chat"});
    }
    const uuidv = uuid.v4();

    const link = `https:test.com/group-chat/${req.body.chatName}/${uuidv}`;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    chat.link=link;
    chat.expiry=expirationDate
    const success=await chat.save();
    if(!success){
        throw new Error("Error while creating group chat link");
    }
    return res.status(201).json({msg:"group chat link created successfully",link:link});


})


module.exports={
    chat,
    fetchChat,
    addUser,
    removeUser,
    rename,
    addAdmin,
    ceateLink
}