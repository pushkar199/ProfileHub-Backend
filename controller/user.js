const User = require('../model/user')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config()




async function register(req, res) {
    try {
        const { email, password, name, bio, phone, photo, isPublic, role } = req.body;

        // Check if required fields are present
        if (!email || !name || !password || !role) {
            return res.status(400).send({ status: "failed", message: "All Fields are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: "failed", message: "Invalid email format" });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).send({ status: "failed", message: "Password must be at least 6 characters long" });
        }

        // Validate isPublic field
        const isValidBoolean = typeof isPublic === 'boolean';
        if (isPublic !== undefined && !isValidBoolean) {
            return res.status(400).send({ status: "failed", message: "Invalid value for isPublic field" });
        }

        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(403).send({ status: "failed", message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email: email,
            password: hashedPassword,
            name: name,
            bio: bio,
            phone: phone,
            photo: photo,
            isPublic: isPublic === undefined ? true : isPublic, // Set default value if isPublic is not provided
            role: role
        });

        await newUser.save();
        
        // Generate JWT token for authentication
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '6h' });

        return res.status(200).send({ status: "successful", data: { ...newUser._doc, token } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Something went wrong" });
    }
}


async function login(req,res) {
    try {
        const {email, password} = req.body
        if(!email || !password) return res.status(400).json({ msg: "Please enter all fields" })
        const user = await User.findOne({ email:email })
        // Check if user exists
        if (!user) return res.status(400).json({ msg: "No user found" })
        // Validate the password
        const validPass = await bcrypt.compare(password, user.password)
        if (!validPass) return res.status(400).json({ msg: "Invalid Password" })
        // Return json webtoken
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        return res.send({status: "Success", message: "Login Successfully", token : token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "something went wrong"})
    }
}

async function allUsers(req,res){
    try {
        const userId = req.userId;
        const user = await User.findOne({ _id: userId });
        console.log(user)
        const obj = {}
        if (user.role === "admin"){
            const users =  await User.find();
            obj.data = users;
            return res.status(200).send({status: "Success", data: obj});
        }else if (user.role ==="user"){
            const users = await User.find({ isPublic: true})
            obj.data = users;
            return res.status(200).send({status: "Success", data: obj});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "something went wrong"})
    }
}


async function profile (req,res){
    try {
        const userId = req.userId;
        const user = await User.findOne({ _id: userId });
        console.log(user);
        return res.status(200).send({ data: user, status: "Success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "something went wrong"})
    }
}

async function updateProfile(req,res){
    try {
        const userId = req.userId;
        const user = await User.findOne({ _id: userId });
        let name_new = req.body.name;
        let bio_new = req.body.bio;
        let phone_new = req.body.phone;
        let isPublic_new = req.body.isPublic;
        let password_new = req.body.password;
        if (!req.body.name) {
            name_new = user.name;
        }
        if (!req.body.bio) {
            bio_new = user.bio;
        }
        if (!req.body.phone) {
            phone_new = user.phone;
        }
        if (!req.body.isPublic) {
            isPublic_new = user.isPublic;
        }
        if(!password_new){
        var userupdate =  await User.updateOne(
            { _id: user._id },
            { $set: { name: name_new, bio: bio_new, phone: phone_new, isPublic: isPublic_new } }
        );
        } else {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password_new, salt);
        var userupdate =  await User.updateOne(
            { _id: user._id },
            { $set: { name: name_new,password:hashpassword, bio: bio_new, phone: phone_new, isPublic: isPublic_new } }
        );
        }
        console.log("userupdate",userupdate);
        const user1 = await User.findOne({ _id: req.userID });
        return res.status(200).send({
        status: "Success",
        "message":"Data Updateed Succesfully",
        data: user1,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "something went wrong"})
    }
}

async function uploadPhoto (req,res){
    try {
        const userId = req.userId;
        const { photoUrl } = req.body; // Assuming the request body contains the photo URL
        
        // Find the user by ID
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Update the user's photo URL
        user.photo = photoUrl;
        await user.save();
        
        return res.status(200).json({ message: "Photo updated successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}





module.exports = {register,login, allUsers, profile, updateProfile,uploadPhoto};