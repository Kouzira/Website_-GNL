const QuestionPost = require('../models/QuestionPost');
const Answer = require('../models/Answer');

exports.getQuestions = async (req, res) => {
  try {
    const questions = await QuestionPost.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(questions);
  } catch {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Thiếu title hoặc content' });
    const question = new QuestionPost({ title, content, author: req.user.id });
    await question.save();
    res.json(question);
  } catch {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.qid }).populate('author', 'username').sort({ createdAt: 1 });
    res.json(answers);
  } catch {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.createAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Thiếu content' });
    const answer = new Answer({ content, questionId: req.params.qid, author: req.user.id });
    await answer.save();
    res.json(answer);
  } catch {
    res.status(500).json({ message: 'Lỗi server' });
  }
};
