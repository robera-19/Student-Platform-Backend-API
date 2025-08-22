const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentSchema = new Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
},
  courseId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
},
  content: { 
    type: String, 
    default: '' 
},
  dueDate: { 
    type: Date, 
    required: true 
}
}, { timestamps: true });

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;