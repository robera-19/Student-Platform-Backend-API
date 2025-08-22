const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  title: {
     type: String, 
     required: true, 
     trim: true 
    },
  description: {
     type: String,
     required: true,
     trim: true, 
    },
  teacherId: {
     type: Schema.Types.ObjectId, // Reference to User model
     ref: 'User', 
     required: true 
    }
}, { timestamps: true });

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;