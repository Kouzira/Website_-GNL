const Question = require('../models/Question');
const Result = require('../models/Result');

exports.getExamQuestions = async (req, res) => {
  try {
    // Lấy câu hỏi theo đúng cấu trúc đề thi

    // 1] Sử dụng ngôn ngữ
    const tiengVietQs = await Question.find({
      category: "Sử dụng ngôn ngữ",
      subcategory: "Tiếng Việt"
    }).limit(30);

    const tiengAnhQs = await Question.find({
      category: "Sử dụng ngôn ngữ",
      subcategory: "Tiếng Anh"
    }).limit(30);

    // 2] Toán học
    const toanHocQs = await Question.find({
      category: "Toán học",
      subcategory: "Toán học"
    }).limit(30);

    // 3] Tư duy khoa học
    const logicQs = await Question.find({
      category: "Tư duy khoa học",
      subcategory: { $in: ["Logic, phân tích số liệu"] }
    }).limit(12);

    const suyluanQs = await Question.find({
      category: "Tư duy khoa học",
      subcategory: "Suy luận khoa học"
    }).limit(18);

    // Kiểm tra đủ câu hỏi
    if (
      tiengVietQs.length < 30 ||
      tiengAnhQs.length < 30 ||
      toanHocQs.length < 30 ||
      logicQs.length < 12 ||
      suyluanQs.length < 18
    ) {
      return res.status(400).json({
        error: `Không đủ câu hỏi cho đề thi. Vui lòng bổ sung dữ liệu.`
      });
    }

    // Ghép đề thi theo thứ tự phần 1 -> 2 -> 3
    const questions = [
      ...tiengVietQs,
      ...tiengAnhQs,
      ...toanHocQs,
      ...logicQs,
      ...suyluanQs,
    ];

    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lấy câu hỏi thất bại' });
  }
};

exports.saveResult = async (req, res) => {
  try {
    const { userId, score, totalQuestions, correctCount, timeTaken } = req.body;

    if (score == null || totalQuestions == null || correctCount == null || timeTaken == null) {
      return res.status(400).json({ error: 'Dữ liệu không đầy đủ' });
    }

    const newResult = new Result({
      userId,
      score,
      totalQuestions,
      correctCount,
      timeTaken
    });

    await newResult.save();

    res.json({ message: 'Lưu kết quả thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lưu kết quả thất bại' });
  }
};

exports.getResults = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log('userId:', userId);

    let filter = {};
    if (userId) filter.userId = userId;  // Lọc kết quả theo userId

    const results = await Result.find(filter).sort({ createdAt: -1 });  // Sắp xếp theo thời gian giảm dần
    console.log('Results:', results);  // Log kết quả trả về từ database

    res.json({ results });  // Trả kết quả cho frontend
  } catch (error) {
    console.error(error);  // Log lỗi nếu có
    res.status(500).json({ error: 'Lấy kết quả thất bại' });
  }
};
