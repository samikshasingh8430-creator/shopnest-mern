const express = require("express");
const router = express.Router();
const {registerUser,loginUser,getUsers} = require("../controller/authController")
const{ protect } = require("../middleware/authMiddleware");
const {admin} = require("../middleware/adminMiddleware");

router.get("/",(req,res)=>{
    res.send("auth route is working properly")
});
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/users",protect,admin,getUsers);




module.exports = router;
