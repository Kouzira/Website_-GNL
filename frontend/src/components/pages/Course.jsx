import React from 'react';

// Component hiển thị mỗi khóa học
const Course = ({ course }) => {
  const firstLetter = course.name.charAt(0).toUpperCase(); // Lấy chữ cái đầu tiên của tên khóa học

  return (
    <div style={styles.card}>
      {/* Thumbnail là chữ cái đầu tiên của tên khóa học */}
      <div style={styles.thumbnail}>
        <span style={styles.thumbnailText}>{firstLetter}</span>
      </div>
      <div style={styles.cardContent}>
        <h2 style={styles.title}>{course.name}</h2>
        <p style={styles.instructor}>{course.instructor}</p>
        <p style={styles.description}>{course.description}</p>
      </div>
      <div style={styles.footer}>
        <span style={styles.price}>{course.price} VND</span>
        <button style={styles.enrollButton}>Enroll</button>
      </div>
    </div>
  );
};

// Các style cơ bản cho card
const styles = {
  card: {
    width: '250px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    backgroundColor: 'white',
    marginBottom: '20px',
  },
  thumbnail: {
    width: '100%',
    height: '150px',
    backgroundColor: '#007bff', // Màu nền cho vòng tròn
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailText: {
    fontSize: '50px',
    color: 'white',
    fontWeight: 'bold',
  },
  cardContent: {
    padding: '15px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  instructor: {
    fontSize: '14px',
    color: '#555',
  },
  description: {
    fontSize: '12px',
    color: '#777',
    marginTop: '10px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f9f9f9',
  },
  price: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  enrollButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Course;