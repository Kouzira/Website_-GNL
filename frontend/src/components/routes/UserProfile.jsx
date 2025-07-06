import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    // email: '',
  });
  const [editMode, setEditMode] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        // email: user.email || '',
      });
    }
  }, [user]);

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Alert severity="warning">Vui lòng đăng nhập để xem thông tin cá nhân.</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/login')}>
            Đăng nhập
          </Button>
        </Box>
      </Container>
    );
  }

  const handleSaveProfile = async () => {
    setLoadingProfile(true);
    try {
      await authApi.updateUser(user._id, { username: formData.username /*, email: formData.email*/ });
      setUser({ ...user, username: formData.username });
      setAlert({ open: true, severity: 'success', message: 'Cập nhật thông tin thành công!' });
      setEditMode(false);
    } catch (error) {
      setAlert({ open: true, severity: 'error', message: error.message || 'Cập nhật thất bại' });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setAlert({ open: true, severity: 'error', message: 'Mật khẩu mới không khớp' });
      return;
    }
    setLoadingPassword(true);
    try {
      await authApi.changePassword(user._id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setAlert({ open: true, severity: 'success', message: 'Đổi mật khẩu thành công!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      setAlert({ open: true, severity: 'error', message: error.message || 'Đổi mật khẩu thất bại' });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main', fontSize: 36 }}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.username}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {user.role === 'admin'
                ? 'Quản trị viên'
                : user.role === 'teacher'
                ? 'Giảng viên'
                : 'Học viên'}
            </Typography>
          </Box>
        </Box>

        {/* Thông tin tài khoản */}
        <Typography variant="h6" gutterBottom>
          Thông tin tài khoản
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              label="Tên đăng nhập"
              fullWidth
              disabled={!editMode}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </Grid>
          {/* Có thể thêm email hoặc avatar upload ở đây */}
          <Grid item xs={12} sm={4}>
            {!editMode ? (
              <Button variant="outlined" onClick={() => setEditMode(true)} fullWidth>
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  disabled={loadingProfile}
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  {loadingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({ username: user.username });
                  }}
                  fullWidth
                >
                  Hủy
                </Button>
              </>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Đổi mật khẩu */}
        <Typography variant="h6" gutterBottom>
          Đổi mật khẩu
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Mật khẩu hiện tại"
              type="password"
              fullWidth
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              autoComplete="current-password"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mật khẩu mới"
              type="password"
              fullWidth
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              autoComplete="new-password"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Xác nhận mật khẩu mới"
              type="password"
              fullWidth
              value={passwordData.confirmNewPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
              autoComplete="new-password"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              disabled={loadingPassword}
              fullWidth
            >
              {loadingPassword ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={() => navigate('/main')}>
            Quay lại
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={alert.severity}
          sx={{ width: '100%' }}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}