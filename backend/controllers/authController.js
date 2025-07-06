const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Tạo token chứa id và role
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    config.jwt.accessTokenSecret,
    { expiresIn: config.jwt.accessTokenExpiry }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    config.jwt.refreshTokenSecret,
    { expiresIn: config.jwt.refreshTokenExpiry }
  );
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Please provide username and password' });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid username or password' });

    await user.updateLastLogin();

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.server.env === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin',
      },
      accessToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(401).json({ message: 'Refresh token is required' });

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshTokenSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError')
        return res.status(401).json({ message: 'Refresh token expired' });
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ message: 'Invalid refresh token' });

    const newAccessToken = generateToken(user);

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    return res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin',
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.server.env === 'production',
      sameSite: 'strict',
    });

    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: 'Username already taken' });

    const user = new User({
      username,
      password,
      role: role || 'student',
    });

    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const updateData = { username, role };

    // Nếu có password mới, hash lại
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    res.json({ message: 'Cập nhật user thành công', user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


module.exports = {
  loginUser,
  refreshToken,
  getCurrentUser,
  logoutUser,
  register,
  changePassword,
  updateUser,
};
