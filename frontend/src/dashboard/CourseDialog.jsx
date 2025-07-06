import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material';
import { Add as AddIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import api from '../api/courses';  // Import the API

const CourseDialog = ({ open, onClose, setCourses, courseData, setCourseData, selectedCourse }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [courses, setCoursesState] = useState([]); // Local state to manage courses

  const handleCourseChange = useCallback((e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  }, [setCourseData]);

  const handleSubmitDialog = async () => {
    if (selectedCourse) {
      try {
        await api.updateCourse(selectedCourse.id, courseData); // Update course API call
        setCourses(prev => prev.map(course => course.id === selectedCourse.id ? { ...selectedCourse, ...courseData } : course));
      } catch (error) {
        console.error('Error updating course:', error);
      }
    } else {
      try {
        const newCourse = await api.createCourse(courseData); // Create course API call
        setCourses([...courses, newCourse]); // Update state with new course
      } catch (error) {
        console.error('Error creating course:', error);
      }
    }
    onClose();
  };

  const handleAddSection = useCallback(() => {
    setCourseData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', description: '', lectures: [] }],
    }));
  }, [setCourseData]);

  const handleSectionChange = useCallback((index, field, value) => {
    setCourseData(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[index][field] = value;
      return { ...prev, sections: updatedSections };
    });
  }, [setCourseData]);

  const handleAddLecture = useCallback(() => {
    if (selectedSection !== null && courseData.sections[selectedSection]) {
      setCourseData(prev => {
        const updatedSections = [...prev.sections];
        updatedSections[selectedSection].lectures.push({ title: '', content: '', videoUrl: '', type: 'video' });
        return { ...prev, sections: updatedSections };
      });
    }
  }, [setCourseData, selectedSection, courseData]);

  const handleLectureChange = useCallback((sectionIndex, lectureIndex, field, value) => {
    setCourseData(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex].lectures[lectureIndex][field] = value;
      return { ...prev, sections: updatedSections };
    });
  }, [setCourseData]);

  const [tabValue, setTabValue] = useState(0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{selectedCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%' }}>
          {/* Tabs for switching between Course Info, Sections, and Lectures */}
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="course tabs">
            <Tab label="Course Info" />
            <Tab label="Sections" />
            <Tab label="Lectures" />
          </Tabs>

          {/* Tab Panels */}
          {tabValue === 0 && (
            <Box sx={{ pt: 2 }}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Course Information</Typography>
                  <TextField
                    name="name"
                    label="Course Name"
                    value={courseData.name}
                    onChange={handleCourseChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="instructor"
                    label="Instructor"
                    value={courseData.instructor}
                    onChange={handleCourseChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="description"
                    label="Description"
                    value={courseData.description}
                    onChange={handleCourseChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                  />
                  <TextField
                    name="price"
                    label="Price"
                    value={courseData.price}
                    onChange={handleCourseChange}
                    fullWidth
                    margin="normal"
                    type="number"
                  />
                </CardContent>
              </Card>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Sections</Typography>
              {courseData.sections.map((section, sectionIndex) => (
                <Accordion key={sectionIndex} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${sectionIndex}-content`} id={`panel-${sectionIndex}-header`}>
                    <Typography variant="subtitle1">{section.title || `Section ${sectionIndex + 1}`} ({section.lectures.length} Lectures)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      label="Section Title"
                      value={section.title}
                      onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Section Description"
                      value={section.description}
                      onChange={(e) => handleSectionChange(sectionIndex, 'description', e.target.value)}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={2}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setSelectedSection(sectionIndex)} // Set the section when clicked
                      sx={{ mb: 2, mt: 2 }}
                    >
                      Select to Add Lecture
                    </Button>
                  </AccordionDetails>
                </Accordion>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddSection}
                sx={{ mt: 2 }}
              >
                Add Section
              </Button>
            </Box>
          )}

          {tabValue === 2 && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Lectures</Typography>
              {/* Show the lectures for the selected section */}
              {selectedSection !== null && courseData.sections[selectedSection] && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Lectures for {courseData.sections[selectedSection].title || `Section ${selectedSection + 1}`}
                  </Typography>
                  {courseData.sections[selectedSection].lectures.map((lecture, lectureIndex) => (
                    <Card key={lectureIndex} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1">Lecture {lectureIndex + 1}</Typography>
                        <TextField
                          label="Lecture Title"
                          value={lecture.title}
                          onChange={(e) => handleLectureChange(selectedSection, lectureIndex, 'title', e.target.value)}
                          fullWidth
                          margin="normal"
                        />
                        <TextField
                          label="Lecture Content"
                          value={lecture.content}
                          onChange={(e) => handleLectureChange(selectedSection, lectureIndex, 'content', e.target.value)}
                          fullWidth
                          margin="normal"
                          multiline
                          rows={3}
                        />
                        <TextField
                          label="Video URL"
                          value={lecture.videoUrl}
                          onChange={(e) => handleLectureChange(selectedSection, lectureIndex, 'videoUrl', e.target.value)}
                          fullWidth
                          margin="normal"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Add Lecture button for the selected section */}
              {selectedSection !== null && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddLecture}
                  sx={{ mt: 2 }}
                >
                  Add Lecture
                </Button>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSubmitDialog} variant="contained" color="primary">
          {selectedCourse ? 'Update Course' : 'Create Course'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseDialog;