
const {getID}=require("../middleware/middle")
let io;

const initSocket=(server)=>{
    io=require("socket.io")(server)
    io.socketToid=new Map();
    io.idTosocket=new Map();
    return io;
}

const getIO=()=>{
    if(!io){
        throw new Error("no socket been initialized")
    }
    return io; 
}

const Connection=(socket)=>{
    socket.on("newUser",async(data)=>{
    
        const userID=getID(data.token); 
        io.socketToid.set(socket.id,userID)
        io.idTosocket.set(userID,socket.id);
    })
    socket.on("disconnect",()=>{
        const userID=io.socketToid.get(socket.id);
        io.socketToid.delete(socket.id);
        io.idTosocket.delete(userID);
    })
}
module.exports={
    initSocket,
    getIO,
    Connection
}