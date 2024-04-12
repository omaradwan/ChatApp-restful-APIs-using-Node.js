const express=require("express");
const { check, validationResult } = require('express-validator');
const userController=require("../controllers/userController");
const { verify } = require("jsonwebtoken");
const router=express.Router();
const multer=require("multer");
const { verifyToken } = require("../middleware/verifyToken");



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let destinationFolder = '';
          const fileType = file.mimetype.split('/')[0];
      if (fileType === 'image') {
        destinationFolder = 'uploads';
      } else if (fileType === 'audio') {
        destinationFolder = 'audio';
      } else {
        return cb(new Error('Unsupported file'), null);
      }
      cb(null, destinationFolder);
      },
  
  
     filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
         const fileName = `${req.current._id}.${ext}`;
          cb(null, fileName); // Set the filename
      },
  });
  
  
  const fileFilter = (req, file, cb) => {
      const fileType = file.mimetype.split("/")[0];
    if (fileType === "image" || fileType === "audio") {
      return cb(null, true);
    } else {
      return cb(new Error("Invalid file type"), false);
    }
  };
  
  const upload = multer({
      storage:storage,
      fileFilter
  })


router.post("/register",[check('name').notEmpty().withMessage('Username is required'),
check('email').isEmail().withMessage('Invalid email'),
check('password').trim().isLength({ min: 6 }).
withMessage('Password must be at least 6 characters long'),

]
,userController.register)    

router.put("/edit",verifyToken,upload.single('avatar'),userController.edit)
router.post("/login",userController.login);
        




module.exports=router;