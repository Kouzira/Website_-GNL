import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { lecturesApi } from '../../api/lectures';

const LectureForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    subjectName: '',
    subtitle: '',
    teacher: '',
    description: '',
    price: 0,
    image: '',
    whatYouWillLearn: [''],
    requirements: [''],
    curriculum: [{ title: '', lessons: [{ title: '', duration: 0 }] }],
    instructor: {
      name: '',
      title: '',
      bio: '',
      avatar: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchLecture = async () => {
        try {
          const data = await lecturesApi.getById(id);
          setFormData(data);
        } catch (err) {
          console.error('Error fetching lecture:', err);
          setError('Không thể tải thông tin khóa học');
        }
      };
      fetchLecture();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInstructorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      instructor: {
        ...prev.instructor,
        [name]: value
      }
    }));
  };

  const handleArrayItemChange = (arrayName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const handleAddArrayItem = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  const handleRemoveArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleCurriculumChange = (sectionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((section, i) => 
        i === sectionIndex ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleLessonChange = (sectionIndex, lessonIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((section, i) => 
        i === sectionIndex ? {
          ...section,
          lessons: section.lessons.map((lesson, j) => 
            j === lessonIndex ? { ...lesson, [field]: value } : lesson
          )
        } : section
      )
    }));
  };

  const handleAddSection = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, { title: '', lessons: [{ title: '', duration: 0 }] }]
    }));
  };

  const handleAddLesson = (sectionIndex) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((section, i) => 
        i === sectionIndex ? {
          ...section,
          lessons: [...section.lessons, { title: '', duration: 0 }]
        } : section
      )
    }));
  };

  const handleRemoveSection = (sectionIndex) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== sectionIndex)
    }));
  };

  const handleRemoveLesson = (sectionIndex, lessonIndex) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((section, i) => 
        i === sectionIndex ? {
          ...section,
          lessons: section.lessons.filter((_, j) => j !== lessonIndex)
        } : section
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await lecturesApi.update(id, formData);
      } else {
        await lecturesApi.create(formData);
      }
      navigate('/lectures');
    } catch (err) {
      console.error('Error saving lecture:', err);
      setError('Không thể lưu khóa học. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin cơ bản
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên môn học"
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phụ đề"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Giảng viên"
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Giá"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hình ảnh"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* What You Will Learn */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Bạn sẽ học được gì?
              </Typography>
              <Stack spacing={2}>
                {formData.whatYouWillLearn.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      value={item}
                      onChange={(e) => handleArrayItemChange('whatYouWillLearn', index, e.target.value)}
                      placeholder="Nhập điểm bạn sẽ học được"
                    />
                    <IconButton 
                      onClick={() => handleRemoveArrayItem('whatYouWillLearn', index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddArrayItem('whatYouWillLearn')}
                >
                  Thêm điểm học được
                </Button>
              </Stack>
            </Grid>

            {/* Requirements */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Yêu cầu
              </Typography>
              <Stack spacing={2}>
                {formData.requirements.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      value={item}
                      onChange={(e) => handleArrayItemChange('requirements', index, e.target.value)}
                      placeholder="Nhập yêu cầu"
                    />
                    <IconButton 
                      onClick={() => handleRemoveArrayItem('requirements', index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddArrayItem('requirements')}
                >
                  Thêm yêu cầu
                </Button>
              </Stack>
            </Grid>

            {/* Curriculum */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Chương trình học
              </Typography>
              <Stack spacing={3}>
                {formData.curriculum.map((section, sectionIndex) => (
                  <Paper key={sectionIndex} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Tên chương"
                        value={section.title}
                        onChange={(e) => handleCurriculumChange(sectionIndex, 'title', e.target.value)}
                      />
                      <IconButton 
                        onClick={() => handleRemoveSection(sectionIndex)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Stack spacing={2}>
                      {section.lessons.map((lesson, lessonIndex) => (
                        <Box key={lessonIndex} sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            fullWidth
                            label="Tên bài học"
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'title', e.target.value)}
                          />
                          <TextField
                            label="Thời lượng (phút)"
                            type="number"
                            value={lesson.duration}
                            onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'duration', Number(e.target.value))}
                            sx={{ width: 150 }}
                          />
                          <IconButton 
                            onClick={() => handleRemoveLesson(sectionIndex, lessonIndex)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => handleAddLesson(sectionIndex)}
                      >
                        Thêm bài học
                      </Button>
                    </Stack>
                  </Paper>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddSection}
                >
                  Thêm chương
                </Button>
              </Stack>
            </Grid>

            {/* Instructor Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin giảng viên
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên giảng viên"
                name="name"
                value={formData.instructor.name}
                onChange={handleInstructorChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Chức danh"
                name="title"
                value={formData.instructor.title}
                onChange={handleInstructorChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiểu sử"
                name="bio"
                value={formData.instructor.bio}
                onChange={handleInstructorChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ảnh đại diện"
                name="avatar"
                value={formData.instructor.avatar}
                onChange={handleInstructorChange}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/lectures')}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Tạo khóa học'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default LectureForm; 