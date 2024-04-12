const express=require("express");

const router=express.Router();
const chatController=require("../controllers/chatController");
const {verifyToken}= require("../middleware/verifyToken");

router.post("/chat",verifyToken,chatController.chat)
router.get("/fetch",verifyToken,chatController.fetchChat);
router.put("/add",verifyToken,chatController.addUser);
router.put("/remove",verifyToken,chatController.removeUser);
router.put("/rename",verifyToken,chatController.rename);
router.put("/addAdmin",verifyToken,chatController.addAdmin);
router.post("/link",verifyToken,chatController.ceateLink);






module.exports=router;