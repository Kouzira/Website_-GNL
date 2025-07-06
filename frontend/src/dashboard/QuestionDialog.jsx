import React, { useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  ViewList as ViewListIcon,
  Category as CategoryIcon,
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const categoriesData = {
  "Sử dụng ngôn ngữ": ["Tiếng Việt", "Tiếng Anh"],
  "Toán học": ["Toán học"],
  "Tư duy khoa học": ["Logic, phân tích số liệu", "Suy luận khoa học"],
};

const QuestionDialog = React.memo(({ 
  open, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  selectedQuestion,
  error 
}) => {
  // Memoize handlers
  const addGroupQuestion = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      groupQuestions: [
        ...prev.groupQuestions,
        {
          content: '',
          options: ['', '', '', ''],
          correctAnswer: ''
        }
      ]
    }));
  }, [setFormData]);

  const removeGroupQuestion = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      groupQuestions: prev.groupQuestions.filter((_, i) => i !== index)
    }));
  }, [setFormData]);

  // Memoize form handlers
  const handleTypeChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, type: e.target.value }));
  }, [setFormData]);

  const handleCategoryChange = useCallback((e) => {
    setFormData(prev => ({ 
      ...prev, 
      category: e.target.value,
      subcategory: '' // Reset subcategory when category changes
    }));
  }, [setFormData]);

  const handleSubcategoryChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, subcategory: e.target.value }));
  }, [setFormData]);

  const handleContentChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
  }, [setFormData]);

  const handleOptionChange = useCallback((index, value) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  }, [setFormData]);

  const handleCorrectAnswerChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, correctAnswer: e.target.value }));
  }, [setFormData]);

  const handleGroupQuestionContentChange = useCallback((index, value) => {
    setFormData(prev => {
      const newGroupQs = [...prev.groupQuestions];
      newGroupQs[index].content = value;
      return { ...prev, groupQuestions: newGroupQs };
    });
  }, [setFormData]);

  const handleGroupQuestionOptionChange = useCallback((questionIndex, optionIndex, value) => {
    setFormData(prev => {
      const newGroupQs = [...prev.groupQuestions];
      newGroupQs[questionIndex].options[optionIndex] = value;
      return { ...prev, groupQuestions: newGroupQs };
    });
  }, [setFormData]);

  const handleGroupQuestionCorrectAnswerChange = useCallback((questionIndex, value) => {
    setFormData(prev => {
      const newGroupQs = [...prev.groupQuestions];
      newGroupQs[questionIndex].correctAnswer = value;
      return { ...prev, groupQuestions: newGroupQs };
    });
  }, [setFormData]);

  // Memoize subcategory options
  const subcategoryOptions = useMemo(() => {
    if (!formData.category) return [];
    return categoriesData[formData.category] || [];
  }, [formData.category]);

  // Memoize dialog title
  const dialogTitle = useMemo(() => (
    <DialogTitle sx={{ 
      pb: 2,
      pt: 3,
      px: 4,
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      color: 'white',
      fontSize: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: 2
    }}>
      {selectedQuestion ? (
        <>
          <EditIcon fontSize="large" />
          Edit Question
        </>
      ) : (
        <>
          <AddIcon fontSize="large" />
          Add New Question
        </>
      )}
    </DialogTitle>
  ), [selectedQuestion]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          minHeight: '80vh',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
        }
      }}
    >
      {dialogTitle}
      <DialogContent sx={{ p: 4 }}>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'rgba(33, 150, 243, 0.05)',
                  border: '1px solid rgba(33, 150, 243, 0.1)'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  Question Type
                </Typography>
                <FormControl fullWidth size="large">
                  <InputLabel>Select Question Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={handleTypeChange}
                    label="Select Question Type"
                  >
                    <MenuItem value="single">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RadioButtonCheckedIcon color="primary" />
                        Single Question
                      </Box>
                    </MenuItem>
                    <MenuItem value="group">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ViewListIcon color="secondary" />
                        Group Question
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            <Grid xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'rgba(33, 150, 243, 0.05)',
                  border: '1px solid rgba(33, 150, 243, 0.1)'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  Category
                </Typography>
                <FormControl fullWidth size="large">
                  <InputLabel>Select Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={handleCategoryChange}
                    label="Select Category"
                  >
                    {Object.keys(categoriesData).map((category) => (
                      <MenuItem key={category} value={category}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CategoryIcon color="primary" />
                          {category}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            <Grid xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'rgba(33, 150, 243, 0.05)',
                  border: '1px solid rgba(33, 150, 243, 0.1)'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  Subcategory
                </Typography>
                <FormControl fullWidth size="large">
                  <InputLabel>Select Subcategory</InputLabel>
                  <Select
                    value={formData.subcategory}
                    onChange={handleSubcategoryChange}
                    label="Select Subcategory"
                    disabled={!formData.category}
                  >
                    {subcategoryOptions.map((subcategory) => (
                      <MenuItem key={subcategory} value={subcategory}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SubdirectoryArrowRightIcon color="primary" />
                          {subcategory}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            <Grid xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'rgba(33, 150, 243, 0.05)',
                  border: '1px solid rgba(33, 150, 243, 0.1)'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  Question Content
                </Typography>
                <TextField
                  fullWidth
                  label="Enter your question"
                  value={formData.content}
                  onChange={handleContentChange}
                  required
                  multiline
                  rows={4}
                  size="large"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }
                  }}
                />
              </Paper>
            </Grid>

            {formData.type === 'single' ? (
              <>
                <Grid xs={12}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      background: 'rgba(33, 150, 243, 0.05)',
                      border: '1px solid rgba(33, 150, 243, 0.1)'
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                      Options
                    </Typography>
                    <Grid container spacing={2}>
                      {formData.options.map((option, index) => (
                        <Grid xs={12} key={index}>
                          <TextField
                            fullWidth
                            label={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            required
                            size="large"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <RadioButtonUncheckedIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                fontSize: '1rem',
                                backgroundColor: 'white'
                              }
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>
                <Grid xs={12}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      background: 'rgba(33, 150, 243, 0.05)',
                      border: '1px solid rgba(33, 150, 243, 0.1)'
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                      Correct Answer
                    </Typography>
                    <FormControl fullWidth size="large">
                      <InputLabel>Select Correct Answer</InputLabel>
                      <Select
                        value={formData.correctAnswer}
                        onChange={handleCorrectAnswerChange}
                        label="Select Correct Answer"
                      >
                        {formData.options.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircleIcon color="success" />
                              {option}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Paper>
                </Grid>
              </>
            ) : (
              <>
                <Grid xs={12}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      background: 'rgba(33, 150, 243, 0.05)',
                      border: '1px solid rgba(33, 150, 243, 0.1)'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ color: '#1976d2' }}>
                        Group Questions
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={addGroupQuestion}
                        size="large"
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          px: 3,
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                        }}
                      >
                        Add Question
                      </Button>
                    </Box>
                    {formData.groupQuestions.map((gq, index) => (
                      <Paper 
                        key={index} 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          mb: 3, 
                          borderRadius: 2,
                          background: 'white',
                          border: '1px solid rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                          <Typography variant="h6" sx={{ color: '#1976d2' }}>
                            Question {index + 1}
                          </Typography>
                          <IconButton
                            color="error"
                            onClick={() => removeGroupQuestion(index)}
                            size="large"
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.1)'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <TextField
                          fullWidth
                          label="Question Content"
                          value={gq.content}
                          onChange={(e) => handleGroupQuestionContentChange(index, e.target.value)}
                          required
                          multiline
                          rows={3}
                          size="large"
                          sx={{ mb: 3 }}
                        />
                        <Grid container spacing={2}>
                          {gq.options.map((option, optIndex) => (
                            <Grid xs={12} key={optIndex}>
                              <TextField
                                fullWidth
                                label={`Option ${optIndex + 1}`}
                                value={option}
                                onChange={(e) => handleGroupQuestionOptionChange(index, optIndex, e.target.value)}
                                required
                                size="large"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <RadioButtonUncheckedIcon color="action" />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    fontSize: '1rem',
                                    backgroundColor: 'white'
                                  }
                                }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                        <FormControl fullWidth size="large" sx={{ mt: 2 }}>
                          <InputLabel>Select Correct Answer</InputLabel>
                          <Select
                            value={gq.correctAnswer}
                            onChange={(e) => handleGroupQuestionCorrectAnswerChange(index, e.target.value)}
                            label="Select Correct Answer"
                          >
                            {gq.options.map((option, optIndex) => (
                              <MenuItem key={optIndex} value={option}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CheckCircleIcon color="success" />
                                  {option}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Paper>
                    ))}
                  </Paper>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 3, background: 'rgba(33, 150, 243, 0.05)' }}>
        <Button 
          onClick={onClose}
          size="large"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 4,
            fontSize: '1rem',
            color: '#666'
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          variant="contained"
          size="large"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 4,
            fontSize: '1rem',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          }}
        >
          {selectedQuestion ? 'Update Question' : 'Create Question'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

QuestionDialog.displayName = 'QuestionDialog';

export default QuestionDialog; 