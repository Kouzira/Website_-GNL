import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { debounce } from 'lodash';
import CourseDialog from './CourseDialog';
import api from '../api/courses'; // Đảm bảo đường dẫn đúng

const CourseRow = React.memo(({ course, onEdit, onDelete, operationLoading }) => (
  <TableRow sx={{ '&:hover': { backgroundColor: '#f5f5f5', transition: 'background-color 0.2s' }, opacity: operationLoading[course.id] ? 0.5 : 1 }}>
    <TableCell sx={{ py: 2 }}>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>{course.name}</Typography>
    </TableCell>
    <TableCell sx={{ py: 2 }}>
      <Typography variant="body1" color="textSecondary">{course.instructor}</Typography>
    </TableCell>
    <TableCell sx={{ py: 2 }}>
      <Typography variant="body1">{course.description}</Typography>
    </TableCell>
    <TableCell sx={{ py: 2 }}>
      <Typography variant="h6" color="primary">${course.price}</Typography>
    </TableCell>
    <TableCell sx={{ py: 2 }}>
      <Typography variant="body1">{course.sections.length} Sections</Typography>
    </TableCell>
    <TableCell sx={{ py: 2 }}>
      <Typography variant="body1">
        {course.sections.reduce((count, section) => count + section.lectures.length, 0)} Lectures
      </Typography>
    </TableCell>
    <TableCell align="right" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Tooltip title="Edit">
          <IconButton color="primary" onClick={() => onEdit(course)} size="large" disabled={operationLoading[course.id]}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => onDelete(course.id)} size="large" disabled={operationLoading[course.id]}>
            {operationLoading[course.id] ? <CircularProgress size={24} color="error" /> : <DeleteIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </TableCell>
  </TableRow>
));

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseData, setCourseData] = useState({
    name: '',
    instructor: '',
    description: '',
    price: '',
    sections: [],
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await api.getCourses(); // Lấy danh sách khóa học từ backend
        setCourses(data);
        setTotal(data.length); // Set total số lượng khóa học
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const debouncedSearch = useMemo(() => debounce((value) => {
    setSearch(value);
    setPage(0);
  }, 300), []);

  const handleSearch = useCallback((event) => {
    debouncedSearch(event.target.value);
  }, [debouncedSearch]);

  const filteredCourses = useMemo(() => {
    if (!search) return courses;
    const searchLower = search.toLowerCase();
    return courses.filter(course =>
      course.name.toLowerCase().includes(searchLower) ||
      course.instructor.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower)
    );
  }, [courses, search]);

  const paginatedCourses = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredCourses.slice(start, end);
  }, [filteredCourses, page, rowsPerPage]);

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setCourseData(course);
    setOpenDialog(true);
  };

  const handleDeleteCourse = async (id) => {
    setOperationLoading(prevState => ({ ...prevState, [id]: true }));
    try {
      await api.deleteCourse(id); // Xóa khóa học thông qua API
      setCourses(courses.filter(course => course.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setOperationLoading(prevState => ({ ...prevState, [id]: false }));
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(null);
    setCourseData({
      name: '',
      instructor: '',
      description: '',
      price: '',
      sections: [],
    });
  };

  const handleSubmitDialog = async () => {
    if (selectedCourse) {
      try {
        await api.updateCourse(selectedCourse.id, courseData); // Cập nhật khóa học thông qua API
        setCourses(courses.map(course => course.id === selectedCourse.id ? { ...selectedCourse, ...courseData } : course));
      } catch (error) {
        console.error('Error updating course:', error);
      }
    } else {
      try {
        const newCourse = await api.createCourse(courseData); // Tạo mới khóa học thông qua API
        setCourses([...courses, newCourse]);
      } catch (error) {
        console.error('Error creating course:', error);
      }
    }
    handleCloseDialog();
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Grid container spacing={3} justifyContent="center" direction="column">
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, display: 'flex', gap: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mr: 3 }}>
              Course Management
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                fullWidth
                label="Search Courses"
                value={search}
                onChange={handleSearch}
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2, bgcolor: '#fff' }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
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
                ADD COURSE
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 3, boxShadow: 2 }}>
            <TableContainer>
              <Table sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableHead>
                  <TableRow sx={{ background: '#fafbfc' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Course Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Instructor</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Sections</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Lectures</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCourses.map((course, index) => (
                    <CourseRow
                      key={course.id || index}
                      course={course}
                      onEdit={handleEditCourse}
                      onDelete={handleDeleteCourse}
                      operationLoading={operationLoading}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredCourses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              sx={{ borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}
            />
          </Paper>
        </Grid>
      </Grid>

      <CourseDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitDialog}
        setCourses={setCourses}
        courseData={courseData}
        setCourseData={setCourseData}
        selectedCourse={selectedCourse}
      />
    </Box>
  );
};

export default Course;