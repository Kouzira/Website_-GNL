import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getExamResults } from '../../api/exam';

const Result = () => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Lấy kết quả thi từ API khi component được load
    useEffect(() => {
    const userId = localStorage.getItem('userId');  // Lấy userId từ localStorage
    console.log('userId:', userId);  // Log để kiểm tra userId có tồn tại không

    if (userId) {
        // Gọi API để lấy kết quả của người dùng
        getExamResults(userId)
        .then((res) => {
            console.log('API response:', res);  // Log phản hồi từ API
            setResult(res.data.results[0]);  // Lấy kết quả mới nhất
        })
        .catch((error) => {
            console.error('Lỗi khi lấy kết quả:', error);
        });
    }
    }, []);

  // Nếu chưa có kết quả thi, hiển thị thông báo đang tải
  if (!result) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 5 }}>
        <Typography>Đang tải kết quả...</Typography>
      </Box>
    );
  }

  // Hiển thị kết quả thi
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Kết quả thi
      </Typography>
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6">Điểm: {result.score}</Typography>
        <Typography variant="body1" color="text.secondary">
          Số câu đúng: {result.correctCount}/{result.totalQuestions}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Thời gian đã sử dụng: {Math.floor(result.timeTaken / 60)} phút
        </Typography>
      </Paper>

      {/* Quay lại trang chủ */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}  // Điều hướng về trang chủ hoặc trang khác
      >
        Quay lại trang chủ
      </Button>
    </Box>
  );
};

export default Result;