const User = require('../model/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')


const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})
};

const registerUser = async (req,res)=>{
    const {name,email,password} =req.body;
    try{
        const existingUser = await User.findOne({email});
        if (existingUser) 
        {
            return res. status(400).json({message:'User already exists'})
            
        }

        const salt =await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt);


        // TODOS:Hash the password before saving to the database
        // TODOS:IMPLEMENT JWT TOKEN GENERATION FOR AUTHENTICATION
        // TODOS: OTP Sending and verification for email confirmation
     // Implement with cedex
        // TODO: Welcome Mail


        const user = await User.create({name,email,password:hashedpassword}); 
        if(user){
            const otp = Math.floor(100000 + Math.random()* 900000).toString();
            const message = `
            Welcome to shopNest ,${name}! Thank you for registration
            your OTP for shopNest Registration is:${otp}`;

            await sendEmail (email,'welcome to shopNest - your OTP for Registration',message)
            res.status(201).json({
              _id: user._id,
              name: user.name,
              email:user.email,
              role:user.role,
              token: generateToken(user._id)
            })
        }
        else{
            res.status(400).json({message:'Invalid user data'})
        }

    }    catch(error){
    res.status(500).json({message:`register error ${error.message}`})

    }
};

// Login user
const loginUser= async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(user && (await bcrypt.compare(password,user.password))){
            res.json({
                _id: user._id,
                name: user.name,
                email:user.email,
                role:user.role,
                token: generateToken(user._id)
              });

        } else{
            res.status(400).json({message:'Invalid email or password'})
        }
    }
    catch(error){
        res.status(500).json({message:'server error '})
    }
};
const getUsers = async (req,res)=>{
    try{
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch(error){
        res.status(500).json({message:'server error '});
    }
};

module.exports ={
    registerUser,
    loginUser,
    getUsers
}