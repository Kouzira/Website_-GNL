import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  Tooltip,
  Chip,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { fetchUsers, createUser, updateUser, deleteUser } from '../api/admin';

// Memoized table row component
const UserRow = React.memo(({ user, password, onEdit, onDelete, operationLoading }) => (

  <TableRow 
    sx={{ 
      '&:hover': { backgroundColor: '#f5f5f5', transition: 'background-color 0.2s' },
      opacity: operationLoading[user._id] ? 0.5 : 1
    }}
  >
    <TableCell sx={{ py: 2, fontWeight: 500 }}>
      {user.username}
    </TableCell>
    <TableCell sx={{ py: 2 }}>
      <Chip
        label={user.role}
        color={
          user.role === 'admin' 
            ? 'error' 
            : user.role === 'teacher' 
              ? 'primary' 
              : 'success'
        }
        size="medium"
        sx={{ fontSize: '1rem', borderRadius: 999, px: 2, color: '#fff', textTransform: 'lowercase', fontWeight: 600 }}
      />
    </TableCell>
    <TableCell sx={{ py: 2 }}>
      {/* Hiển thị password tại đây */}
      {password || '—'}
    </TableCell>
    <TableCell align="right" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Tooltip title="Edit">
          <IconButton
            color="primary"
            onClick={() => onEdit(user)}
            size="large"
            disabled={operationLoading[user._id]}
            sx={{ color: '#338af3' }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => onDelete(user._id)}
            size="large"
            disabled={operationLoading[user._id]}
            sx={{ color: '#e53935' }}
          >
            {operationLoading[user._id] ? (
              <CircularProgress size={24} color="error" />
            ) : (
              <DeleteIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </TableCell>
  </TableRow>
));

const Users = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [operationLoading, setOperationLoading] = useState({});

  const loadUsers = useCallback(async () => {
    try {
      const response = await fetchUsers(page + 1, rowsPerPage, search);
      console.log('Users from API:', response.users);  // Thêm dòng này để xem dữ liệu
      setUsers(response.users);
      setTotal(response.total);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleOpen = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        password: '',
        role: user.role,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        username: '',
        password: '',
        role: 'student',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      password: '',
      role: 'student',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (selectedUser) {
        setOperationLoading(prev => ({ ...prev, [selectedUser._id]: true }));
        await updateUser(selectedUser._id, formData);
        setSuccess('User updated successfully');
      } else {
        await createUser(formData);
        setSuccess('User created successfully');
      }
      handleClose();
      loadUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      if (selectedUser) {
        setOperationLoading(prev => ({ ...prev, [selectedUser._id]: false }));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setOperationLoading(prev => ({ ...prev, [id]: true }));
        await deleteUser(id);
        setSuccess('User deleted successfully');
        loadUsers();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete user');
      } finally {
        setOperationLoading(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  return (
    <Box sx={{ p: 3, width: '100%', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
     <Grid container spacing={3} justifyContent="center" direction="column">
        {/* Phần Search + nút Add User nằm trên */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mr: 3 }}>
              User Management
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                fullWidth
                label="Search Users"
                value={search}
                onChange={handleSearch}
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: '#fff' },
                }}
                sx={{ borderRadius: 2, bgcolor: '#fff' }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  bgcolor: '#338af3',
                  '&:hover': { bgcolor: '#256ad6' },
                  boxShadow: 2,
                }}
                size="large"
              >
                ADD USER
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Phần bảng danh sách và phân trang */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 3, boxShadow: 2 }}>
            <TableContainer>
              <Table sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableHead>
                  <TableRow sx={{ background: '#fafbfc' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Password</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      password={user.password}
                      onEdit={handleOpen}
                      onDelete={handleDelete}
                      operationLoading={operationLoading}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </TextField>
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!selectedUser}
                  helperText={selectedUser ? "Leave blank to keep current password" : ""}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default Users;
