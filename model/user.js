const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    bio : {type: String},
    phone: {type: String},
    photo: {type: String},
    isPublic: {type: Boolean, default: true},
    role: {type: String , enum : ['user','admin']}
    
});

const User = mongoose.model("User", userSchema);
module.exports = User
