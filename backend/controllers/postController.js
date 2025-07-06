const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Thiếu title hoặc content' });
    const post = new Post({ title, content, author: req.user.id });
    await post.save();
    res.json(post);
  } catch {
    res.status(500).json({ message: 'Lỗi server' });
  }
};
