const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
     type: String, 
     unique: true, 
     trim: true, // removes space from before or after the username
     required: true // can not be empty
    },
  email:    {
     type: String, 
     unique: true, 
     trim: true, 
     required: true 
    },
  password: {
     type: String, 
     required: true,
     select: false // when we fetch user data, password will not be included
    },
  role:     {
     type: String, 
     enum: ['student', 'parent', 'teacher', 'admin'], 
     required: true 
    },
  refreshToken: {
     type: String, 
     select: false 
    }
}, 
{ timestamps: true });

const User = mongoose.model("User" , userSchema);
module.exports = User;