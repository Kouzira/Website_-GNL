const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content: String,
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionPost' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Answer', answerSchema);
