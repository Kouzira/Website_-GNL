// controllers/resultController.js (hoặc file xử lý result)

const Result = require('../models/Result');
const User = require('../models/User');

exports.getTopResults = async (req, res) => {
  try {
    // Lấy top 5 kết quả theo score giảm dần, lấy kèm thông tin user qua populate
    const topResults = await Result.find({})
      .sort({ score: -1, createdAt: 1 })
      .limit(5)
      .populate('userId', 'username')  // lấy username của user

    res.json({ topResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lấy kết quả cao nhất thất bại' });
  }
};

exports.getResultByUserId = async (req, res) => {
  const { userId } = req.params;  // Lấy userId từ request params

  try {
    const result = await Result.findOne({ userId })  // Tìm kết quả của người dùng
      .populate('userId', 'username')  // Lấy thông tin username của người dùng
      .exec();

    if (!result) {
      return res.status(404).json({ message: 'Kết quả không tồn tại.' });
    }

    res.json(result);  // Trả về kết quả cho frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lấy kết quả thất bại' });
  }
};