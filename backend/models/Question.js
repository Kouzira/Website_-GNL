const mongoose = require('mongoose');

const groupQuestionSchema = new mongoose.Schema({
  content: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
  content: { type: String, required: true },
  type: { type: String, enum: ['single', 'group'], required: true },
  category: { type: String, required: true }, 
  subcategory: { type: String, required: true }, 
  options: { type: [String], required: true }, 
  correctAnswer: { type: String },
  groupQuestions: [ // Chỉ dành cho câu hỏi nhóm
    {
      content: { type: String },
      options: { type: [String] },
      correctAnswer: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
