const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  rollNumber:  { type: String, required: true, unique: true },
  email:       { type: String, required: true, unique: true },
  department:  { type: String, required: true },
  password:    { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
