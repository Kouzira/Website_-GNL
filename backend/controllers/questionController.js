const Question = require('../models/Question');
const xlsx = require('xlsx');
const fs = require('fs');

// Dữ liệu danh mục và phân loại
const categoriesData = {
  "Sử dụng ngôn ngữ": ["Tiếng Việt", "Tiếng Anh"],
  "Toán học": ["Toán học"],
  "Tư duy khoa học": ["Logic, phân tích số liệu", "Suy luận khoa học"],
};

exports.uploadQuestions = async (req, res) => {
  try {
    const files = req.files;
    let questions = [];

    for (const file of files) {
      const workbook = xlsx.readFile(file.path);
      const sheetNames = workbook.SheetNames;

      sheetNames.forEach(sheetName => {
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        data.forEach(item => {
          const { category, subcategory } = item;

          // Kiểm tra category và subcategory có hợp lệ không
          if (!categoriesData[category] || !categoriesData[category].includes(subcategory)) {
            return; // Nếu không hợp lệ, bỏ qua câu hỏi này
          }

          // Xử lý câu hỏi đơn
          if (item.type === 'single') {
            questions.push({
              type: 'single',
              content: item.content,
              category,
              subcategory,
              options: [item.option1, item.option2, item.option3, item.option4],
              correctAnswer: item.correctAnswer
            });
          }
          // Xử lý câu hỏi nhóm
          else if (item.type === 'group') {
            const groupQs = [];
            for (let i = 1; i <= 10; i++) { // tối đa 10 câu hỏi con
              if (item[`subQuestion${i}Content`]) {
                groupQs.push({
                  content: item[`subQuestion${i}Content`],
                  options: [
                    item[`subQuestion${i}Option1`],
                    item[`subQuestion${i}Option2`],
                    item[`subQuestion${i}Option3`],
                    item[`subQuestion${i}Option4`]
                  ],
                  correctAnswer: item[`subQuestion${i}CorrectAnswer`]
                });
              }
            }
            questions.push({
              type: 'group',
              content: item.content,
              category,
              subcategory,
              groupQuestions: groupQs
            });
          }
        });
      });

      // Xóa file sau khi đọc xong (tuỳ chọn)
      fs.unlinkSync(file.path);
    }

    // Lưu tất cả các câu hỏi vào cơ sở dữ liệu
    await Question.insertMany(questions);

    res.status(200).json({ message: 'Upload questions successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const data = req.body;

    // Kiểm tra tính hợp lệ của category và subcategory
    if (!categoriesData[data.category] || !categoriesData[data.category].includes(data.subcategory)) {
      return res.status(400).json({ error: 'Category hoặc Subcategory không hợp lệ' });
    }

    // Tạo câu hỏi mới
    const question = new Question(data);
    await question.save();

    res.status(201).json({ message: 'Question created', question });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Create question failed' });
  }
};

// Lấy danh sách câu hỏi (để frontend hiển thị)
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get questions' });
  }
};

// Sửa câu hỏi theo id
exports.updateQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const question = await Question.findByIdAndUpdate(id, data, { new: true });
    if (!question) return res.status(404).json({ error: 'Question not found' });

    res.json({ message: 'Question updated', question });
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
};

// Xóa câu hỏi theo id
exports.deleteQuestion = async (req, res) => {
  try {
    const id = req.params.id;

    const question = await Question.findByIdAndDelete(id);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Delete failed' });
  }
};

// Xóa tất cả câu hỏi
exports.deleteAllQuestions = async (req, res) => {
  try {
    // Log the user attempting to delete all questions
    console.log(`User ${req.user.username} (${req.user.role}) attempting to delete all questions`);

    // Delete all questions
    const result = await Question.deleteMany({});
    
    // Log the result
    console.log(`Deleted ${result.deletedCount} questions`);

    res.json({ 
      message: 'All questions deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all questions:', error);
    res.status(500).json({ 
      error: 'Failed to delete all questions',
      details: error.message 
    });
  }
};
