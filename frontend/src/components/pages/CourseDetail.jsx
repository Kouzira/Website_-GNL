import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import api from '../../api/courses'; // Import API từ file api.js

const CourseDetail = () => {
  const { courseId } = useParams(); // Lấy courseId từ URL
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông tin chi tiết khóa học từ API
    const fetchCourseDetail = async () => {
    try {
        const courseResponse = await api.getCourses();
        const courseDetail = courseResponse.find(course => course._id === courseId);
        if (!courseDetail) {
        throw new Error('Course not found');
        }
        setCourse(courseDetail);

        const sectionResponse = await api.getSections(courseId);
        if (!sectionResponse) {
        throw new Error('Sections not found');
        }
        setSections(sectionResponse);
    } catch (error) {
        console.error('Error fetching course detail:', error);
        alert(error.message); // Hiển thị thông báo lỗi cho người dùng
    } finally {
        setLoading(false);
    }
    };

    fetchCourseDetail();
  }, [courseId]);

  if (loading) {
    return <div style={styles.loading}>Loading course detail...</div>;
  }

  if (!course) {
    return <div style={styles.loading}>Course not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {/* Bỏ thumbnail, chỉ hiển thị thông tin khóa học */}
        <div style={styles.textContent}>
          <h1 style={styles.courseName}>{course.name}</h1>
          <p style={styles.instructor}>Instructor: <strong>{course.instructor}</strong></p>
          <p style={styles.description}>{course.description}</p>
        </div>
      </div>

      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Sections</h2>
        <div style={styles.sections}>
          {sections.length === 0 ? (
            <p>No sections available.</p>
          ) : (
            sections.map((section) => (
              <div key={section._id} style={styles.section}>
                <h3 style={styles.sectionName}>{section.title}</h3>
                <p style={styles.sectionDescription}>{section.description}</p>

                <h4 style={styles.lectureTitle}>Lectures</h4>
                <ul style={styles.lectureList}>
                  {section.lectures.map((lecture) => (
                    <li key={lecture._id} style={styles.lectureItem}>
                      <strong>{lecture.title}</strong> - {lecture.contentType === 'video' ? 'Video' : 'Text'}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f4f4f9',
    padding: '40px',
    maxWidth: '900px',
    margin: '0 auto',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '40px',
  },
  textContent: {
    maxWidth: '600px',
  },
  courseName: {
    fontSize: '36px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  instructor: {
    fontSize: '18px',
    color: '#555',
    marginTop: '10px',
  },
  description: {
    fontSize: '16px',
    color: '#777',
    marginTop: '20px',
  },
  sectionContainer: {
    marginTop: '40px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '500',
    color: '#333',
    borderBottom: '2px solid #007bff',
    display: 'inline-block',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  sections: {
    marginTop: '20px',
  },
  section: {
    marginBottom: '40px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  },
  sectionName: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  sectionDescription: {
    fontSize: '16px',
    color: '#777',
    marginTop: '10px',
  },
  lectureTitle: {
    fontSize: '22px',
    fontWeight: '500',
    marginTop: '20px',
    color: '#333',
  },
  lectureList: {
    listStyleType: 'none',
    paddingLeft: '0',
    marginTop: '10px',
  },
  lectureItem: {
    fontSize: '16px',
    color: '#555',
    marginLeft: '20px',
    marginBottom: '8px',
    paddingLeft: '5px',
    transition: 'transform 0.2s ease',
  },
  loading: {
    textAlign: 'center',
    fontSize: '20px',
    marginTop: '20px',
  },
};

// Hover effects
styles.section[':hover'] = {
  transform: 'scale(1.05)',
};

styles.lectureItem[':hover'] = {
  transform: 'scale(1.02)',
  cursor: 'pointer',
};

export default CourseDetail;