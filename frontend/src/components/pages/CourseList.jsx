import React, { useEffect, useState } from 'react';
import api from '../../api/courses'; // Import API từ file api.js
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate để điều hướng
import CourseCard from './Course'; // Giả sử bạn đã tạo component CourseCard

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Tạo đối tượng navigate để điều hướng

  useEffect(() => {
    // Lấy dữ liệu khóa học từ API
    const fetchCourses = async () => {
      try {
        const response = await api.getCourses(); // Sử dụng API để lấy khóa học
        setCourses(response); // Cập nhật danh sách khóa học
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false); // Đổi trạng thái loading khi dữ liệu đã được lấy
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    // Điều hướng đến chi tiết khóa học khi người dùng click vào khóa học
    navigate(`/coursedetail/${courseId}`);
  };

  if (loading) {
    return <div style={styles.loading}>Loading courses...</div>;
  }

  return (
    <div style={styles.courseList}>
      {courses.map((course) => (
        <div key={course._id} onClick={() => handleCourseClick(course._id)}>
          <CourseCard course={course} /> {/* Hiển thị mỗi khóa học */}
        </div>
      ))}
    </div>
  );
};

const styles = {
  courseList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '20px',
    marginTop: '20px',
  },
};

export default CourseList;
