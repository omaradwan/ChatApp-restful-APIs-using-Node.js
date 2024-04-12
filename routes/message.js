const express=require("express");

const router=express.Router();
const messageController=require("../controllers/messageController");
const {verifyToken}= require("../middleware/verifyToken");

router.post("/add",verifyToken,messageController.addMessage)
router.get("/get",verifyToken,messageController.getMsg)
router.get("/readBy",verifyToken,messageController.readby);



module.exports=router;