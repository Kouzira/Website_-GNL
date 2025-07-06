import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@mui/icons-material';
import { debounce } from 'lodash';
import {
  getQuestionsAPI,
  createQuestionAPI,
  updateQuestionAPI,
  deleteQuestionAPI,
  deleteAllQuestionsAPI,
  uploadQuestionsAPI
} from '../api/questions';

// Lazy load the dialog component
const QuestionDialog = lazy(() => import('./QuestionDialog'));

// Memoized table row component with fixed correctAnswer display
const QuestionRow = React.memo(({ question, onEdit, onDelete, operationLoading }) => (
  <TableRow 
    sx={{ 
      '&:hover': { 
        backgroundColor: '#f5f5f5',
        transition: 'background-color 0.2s'
      },
      opacity: operationLoading[question._id] ? 0.5 : 1
    }}
  >
    <TableCell sx={{ py: 2 }}>
      <Chip
        label={question.type}
        color={question.type === 'single' ? 'primary' : 'secondary'}
        size="medium"
        sx={{ fontSize: '0.9rem' }}
      />
    </TableCell>
    <TableCell sx={{ py: 2 }}>
      <Box>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 0.5 }}>
          {question.category}
        </Typography>
        <Typography variant="body1">
          {question.subcategory}
        </Typography>
      </Box>
    </TableCell>
    <TableCell sx={{ py: 2, minWidth: 300 }}>
      <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
        {question.content}
      </Typography>
      {question.type === 'group' && question.groupQuestions && (
        <Box sx={{ mt: 2 }}>
          {question.groupQuestions.map((gq, index) => (
            <Typography key={index} variant="body1" color="textSecondary" sx={{ mb: 1 }}>
              {index + 1}. {gq.content}
            </Typography>
          ))}
        </Box>
      )}
    </TableCell>
    <TableCell sx={{ py: 2, minWidth: 250 }}>
      {question.type === 'single' ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {question.options && question.options.map((option, index) => (
            <Chip
              key={index}
              label={option}
              size="medium"
              sx={{ 
                backgroundColor: '#e3f2fd',
                '&:hover': {
                  backgroundColor: '#bbdefb'
                },
                fontSize: '0.9rem'
              }}
            />
          ))}
        </Box>
      ) : (
        question.groupQuestions && question.groupQuestions.map((gq, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
              Question {index + 1}:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {gq.options.map((option, optIndex) => (
                <Chip
                  key={optIndex}
                  label={option}
                  size="medium"
                  sx={{ 
                    backgroundColor: '#e3f2fd',
                    '&:hover': {
                      backgroundColor: '#bbdefb'
                    },
                    fontSize: '0.9rem'
                  }}
                />
              ))}
            </Box>
          </Box>
        ))
      )}
    </TableCell>
    <TableCell sx={{ py: 2, minWidth: 200 }}>
      {question.type === 'single' ? (
        <Chip
          label={question.options && question.options[question.correctAnswer]}
          color="success"
          size="medium"
          sx={{ 
            fontWeight: 500,
            fontSize: '0.9rem',
            whiteSpace: 'normal',
            maxWidth: 180,
            overflowWrap: 'break-word'
          }}
        />
      ) : (
        question.groupQuestions && question.groupQuestions.map((gq, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
              Q{index + 1}:
            </Typography>
            <Chip
              label={gq.options[gq.correctAnswer]}
              color="success"
              size="medium"
              sx={{ 
                fontSize: '0.9rem',
                whiteSpace: 'normal',
                maxWidth: 180,
                overflowWrap: 'break-word'
              }}
            />
          </Box>
        ))
      )}
    </TableCell>
    <TableCell align="right" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Tooltip title="Edit">
          <IconButton
            color="primary"
            onClick={() => onEdit(question)}
            size="large"
            disabled={operationLoading[question._id]}
            sx={{ 
              '&:hover': { 
                backgroundColor: '#e3f2fd'
              }
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => onDelete(question._id)}
            size="large"
            disabled={operationLoading[question._id]}
            sx={{ 
              '&:hover': { 
                backgroundColor: '#ffebee'
              }
            }}
          >
            {operationLoading[question._id] ? (
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

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [formData, setFormData] = useState({
    type: 'single',
    content: '',
    category: '',
    subcategory: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    groupQuestions: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDeleteAllDialog, setOpenDeleteAllDialog] = useState(false);
  const [operationLoading, setOperationLoading] = useState({});
  const [localQuestions, setLocalQuestions] = useState([]);

  // Memoize initial form data
  const initialFormData = useMemo(() => ({
    type: 'single',
    content: '',
    category: '',
    subcategory: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    groupQuestions: []
  }), []);

  // Optimize search with debounce
  const debouncedSearch = useMemo(
    () => debounce((value) => {
      setSearch(value);
      setPage(0);
    }, 300),
    []
  );

  const handleSearch = useCallback((event) => {
    debouncedSearch(event.target.value);
  }, [debouncedSearch]);

  // Optimize loadQuestions with pagination and search
  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getQuestionsAPI();
      const questions = response.data || [];
      setQuestions(questions);
      setLocalQuestions(questions);
      setTotal(questions.length);
    } catch (error) {
      setSnackbarMessage('Failed to load questions');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Memoize filtered questions
  const filteredQuestions = useMemo(() => {
    if (!search) return localQuestions;
    const searchLower = search.toLowerCase();
    return localQuestions.filter(q => 
      q.content.toLowerCase().includes(searchLower) ||
      q.category.toLowerCase().includes(searchLower) ||
      q.subcategory.toLowerCase().includes(searchLower) ||
      (q.options && q.options.some(opt => opt.toLowerCase().includes(searchLower)))
    );
  }, [localQuestions, search]);

  // Memoize paginated questions
  const paginatedQuestions = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredQuestions.slice(start, end);
  }, [filteredQuestions, page, rowsPerPage]);

  // Optimize handlers
  const handleOpen = useCallback((question = null) => {
    if (question) {
      setSelectedQuestion(question);
      setFormData({
        type: question.type,
        content: question.content,
        category: question.category,
        subcategory: question.subcategory,
        options: question.options || ['', '', '', ''],
        correctAnswer: question.correctAnswer || '',
        groupQuestions: question.groupQuestions || []
      });
    } else {
      setSelectedQuestion(null);
      setFormData(initialFormData);
    }
    setOpen(true);
  }, [initialFormData]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedQuestion(null);
    setFormData(initialFormData);
    setError('');
  }, [initialFormData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const questionData = { ...formData };
      
      if (selectedQuestion) {
        setLocalQuestions(prev => 
          prev.map(q => q._id === selectedQuestion._id ? { ...q, ...questionData } : q)
        );
        
        await updateQuestionAPI(selectedQuestion._id, questionData);
        setSnackbarMessage('Question updated successfully');
      } else {
        const tempId = Date.now().toString();
        setLocalQuestions(prev => [...prev, { ...questionData, _id: tempId }]);
        
        const response = await createQuestionAPI(questionData);
        setLocalQuestions(prev => 
          prev.map(q => q._id === tempId ? response.data.question : q)
        );
        setSnackbarMessage('Question created successfully');
      }
      
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleClose();
      loadQuestions();
    } catch (error) {
      loadQuestions();
      setSnackbarMessage(error.response?.data?.message || 'An error occurred');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  }, [formData, selectedQuestion, handleClose, loadQuestions]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      setOperationLoading(prev => ({ ...prev, [id]: true }));
      setLocalQuestions(prev => prev.filter(q => q._id !== id));
      
      await deleteQuestionAPI(id);
      setSnackbarMessage('Question deleted successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      loadQuestions();
    } catch (error) {
      loadQuestions();
      setSnackbarMessage(error.response?.data?.message || 'Failed to delete question');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setOperationLoading(prev => ({ ...prev, [id]: false }));
    }
  }, [loadQuestions]);

  const handleDeleteAllQuestions = useCallback(async () => {
    try {
      setOperationLoading(prev => ({ ...prev, deleteAll: true }));
      setLocalQuestions([]);
      
      await deleteAllQuestionsAPI();
      setSnackbarMessage('All questions have been deleted successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      loadQuestions();
    } catch (error) {
      loadQuestions();
      if (error.message === 'Authentication required') {
        setSnackbarMessage('Please log in to perform this action');
      } else if (error.message === 'Admin access required') {
        setSnackbarMessage('Only administrators can delete all questions');
      } else {
        setSnackbarMessage(error.message || 'Failed to delete all questions');
      }
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setOperationLoading(prev => ({ ...prev, deleteAll: false }));
      setOpenDeleteAllDialog(false);
    }
  }, [loadQuestions]);

  const handleFileUpload = useCallback(async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    try {
      setOperationLoading(prev => ({ ...prev, upload: true }));
      await uploadQuestionsAPI(files);
      setSnackbarMessage('Questions uploaded successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      loadQuestions();
    } catch (error) {
      setSnackbarMessage(error.response?.data?.error || 'Failed to upload questions');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setOperationLoading(prev => ({ ...prev, upload: false }));
      event.target.value = '';
    }
  }, [loadQuestions]);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 4,
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#1a237e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2
                  }}
                >
                  Question Management
                  <Chip 
                    label={`${total} Questions`}
                    size="medium"
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '1rem' }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    placeholder="Search questions..."
                    value={search}
                    onChange={handleSearch}
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'white',
                        fontSize: '1rem'
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    size="large"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      whiteSpace: 'nowrap',
                      minWidth: '160px'
                    }}
                  >
                    Add Question
                  </Button>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    style={{ display: 'none' }}
                    id="upload-excel"
                    onChange={handleFileUpload}
                    multiple
                  />
                  <Button
                    variant="contained"
                    component="label"
                    htmlFor="upload-excel"
                    startIcon={<UploadIcon />}
                    size="large"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                      boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                      whiteSpace: 'nowrap',
                      minWidth: '160px'
                    }}
                  >
                    Upload Excel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DeleteSweepIcon />}
                    onClick={() => setOpenDeleteAllDialog(true)}
                    size="large"
                    disabled={operationLoading.deleteAll}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
                      boxShadow: '0 3px 5px 2px rgba(244, 67, 54, .3)',
                      whiteSpace: 'nowrap',
                      minWidth: '160px',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #d32f2f 30%, #ef5350 90%)',
                      }
                    }}
                  >
                    {operationLoading.deleteAll ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Delete All'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper 
            elevation={3}
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              background: 'white',
              minHeight: '60vh'
            }}
          >
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                p: 8,
                minHeight: 400
              }}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              <>
                <TableContainer sx={{ maxHeight: '70vh' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: '1rem', py: 2 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '1rem', py: 2 }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '1rem', py: 2, minWidth: '300px' }}>Content</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '1rem', py: 2, minWidth: '250px' }}>Options</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '1rem', py: 2, minWidth: '200px' }}>Correct Answer</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1rem', py: 2 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedQuestions && paginatedQuestions.length > 0 ? (
                        paginatedQuestions.map((question) => (
                          <QuestionRow 
                            key={question._id} 
                            question={question}
                            onEdit={handleOpen}
                            onDelete={handleDelete}
                            operationLoading={operationLoading}
                          />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                            <Typography variant="h5" color="textSecondary" sx={{ mb: 2 }}>
                              No questions found
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              Try adjusting your search or add a new question
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Divider />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredQuestions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                  sx={{
                    '.MuiTablePagination-select': {
                      borderRadius: 1
                    },
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                      fontSize: '1rem'
                    }
                  }}
                />
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Suspense fallback={
        <Dialog open={open} onClose={handleClose}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        </Dialog>
      }>
        {open && (
          <QuestionDialog
            open={open}
            onClose={handleClose}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            selectedQuestion={selectedQuestion}
            error={error}
          />
        )}
      </Suspense>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbarSeverity} 
          onClose={() => setOpenSnackbar(false)}
          sx={{ 
            fontSize: '1rem',
            borderRadius: 2
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog 
        open={openDeleteAllDialog} 
        onClose={() => setOpenDeleteAllDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2,
          pt: 3,
          px: 4,
          background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          Confirm Delete All Questions
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 2 }}>
            Are you sure you want to delete <b>all</b> questions? This action cannot be undone!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 3 }}>
          <Button 
            onClick={() => setOpenDeleteAllDialog(false)}
            size="large"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 4,
              fontSize: '1rem'
            }}
          >
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={handleDeleteAllQuestions}
            size="large"
            disabled={operationLoading.deleteAll}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 4,
              fontSize: '1rem',
              background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
              boxShadow: '0 3px 5px 2px rgba(244, 67, 54, .3)',
            }}
          >
            {operationLoading.deleteAll ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Delete All'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Questions;