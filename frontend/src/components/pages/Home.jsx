import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Avatar,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import QuizIcon from '@mui/icons-material/Quiz';
import { fetchTopResults } from "../../api/result"; // API gọi backend lấy top điểm
import { useAuth } from '../../contexts/AuthContext';

const featuredCourses = [
  {
    title: "Lập trình React căn bản đến nâng cao",
    instructor: "Thầy John Doe",
    rating: 4.8,
    price: "Miễn phí",
    img: "https://source.unsplash.com/featured/?code",
  },
  {
    title: "Toán học dành cho học sinh trung học",
    instructor: "Cô Jane Smith",
    rating: 4.6,
    price: "200,000đ",
    img: "https://source.unsplash.com/featured/?math",
  },
  {
    title: "Tư duy logic và phân tích dữ liệu",
    instructor: "Thầy Alex Nguyen",
    rating: 4.7,
    price: "300,000đ",
    img: "https://source.unsplash.com/featured/?data",
  },
  {
    title: "Phát triển kỹ năng mềm cho sinh viên",
    instructor: "Cô Mai Trần",
    rating: 4.5,
    price: "150,000đ",
    img: "https://source.unsplash.com/featured/?skills",
  },
  {
    title: "Quản lý dự án cơ bản",
    instructor: "Anh Hùng Phạm",
    rating: 4.4,
    price: "250,000đ",
    img: "https://source.unsplash.com/featured/?project",
  },
];

const medalColors = [
  '#ffd700', // Gold
  '#c0c0c0', // Silver
  '#cd7f32', // Bronze
];

const quizOfTheDay = {
  question: "Ngôn ngữ lập trình nào được sử dụng để xây dựng React?",
  options: ["Python", "JavaScript", "C++", "Java"],
  answer: 1,
};

export default function Home() {
  const [topScores, setTopScores] = useState([]);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTopResults()
      .then(res => {
        const data = res.data.topResults.map(item => ({
          username: item.userId?.username || "Người dùng ẩn danh",
          score: item.score,
        }));
        setTopScores(data);
      })
      .catch(err => {
        console.error("Lấy top điểm thất bại", err);
      });
  }, []);

  // Quiz of the Day logic
  const handleQuizSelect = (idx) => {
    setQuizSelected(idx);
    setQuizResult(idx === quizOfTheDay.answer);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 0, px: 2, bgcolor: '#f5f7fa', minHeight: '100vh', pb: 6 }}>
      {/* Personalized Welcome Banner */}
      <Box sx={{
        width: '100%',
        minHeight: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: '#232946',
        color: '#fff',
        borderRadius: 3,
        boxShadow: 2,
        mt: 4,
        mb: 4,
        p: { xs: 2, md: 4 },
        textAlign: { xs: 'center', md: 'left' },
        gap: 2,
      }}>
        <Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            {user ? `Chào mừng trở lại, ${user.username}!` : 'Chào mừng đến với Nền tảng Đánh Giá Năng Lực'}
          </Typography>
          <Typography variant="subtitle1" color="#b8c1ec">
            {user ? 'Chúc bạn một ngày học tập hiệu quả và nhiều thành tích!' : 'Đăng nhập để lưu tiến trình học tập và nhận nhiều ưu đãi.'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ mt: { xs: 2, md: 0 } }}>
        </Stack>
      </Box>

      {/* News/Announcement Card & Quiz of the Day */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#fff', borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <QuizIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={700}>
                  Quiz of the Day
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                {quizOfTheDay.question}
              </Typography>
              <Stack spacing={1}>
                {quizOfTheDay.options.map((opt, idx) => (
                  <Button
                    key={opt}
                    variant={quizSelected === idx ? (quizResult ? 'contained' : 'outlined') : 'outlined'}
                    color={quizSelected === idx ? (quizResult ? 'success' : 'error') : 'primary'}
                    onClick={() => handleQuizSelect(idx)}
                    disabled={quizSelected !== null}
                    sx={{ justifyContent: 'flex-start', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    {opt}
                    {quizSelected === idx && quizResult && (
                      <FavoriteBorderIcon color="success" sx={{ ml: 1 }} />
                    )}
                  </Button>
                ))}
              </Stack>
              {quizSelected !== null && (
                <Typography mt={2} color={quizResult ? 'success.main' : 'error.main'} fontWeight={700}>
                  {quizResult ? 'Chính xác! Bạn thật tuyệt vời!' : 'Chưa đúng, hãy thử lại vào ngày mai!'}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bảng thành tích top điểm thi thử */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" fontWeight="700" mb={2}>
          Bảng thành tích thi thử nổi bật
        </Typography>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch" justifyContent="center">
            {topScores.length === 0 && (
              <Typography variant="body1" sx={{ m: 2 }}>
                Chưa có dữ liệu điểm thi nổi bật.
              </Typography>
            )}
            {topScores.slice(0, 5).map(({ username, score }, idx) => (
              <Paper
                key={idx}
                elevation={idx < 3 ? 6 : 1}
                sx={{
                  backgroundColor: idx < 3 ? medalColors[idx] : '#fafafa',
                  borderRadius: 3,
                  p: 3,
                  minWidth: 180,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: idx < 3 ? 6 : 1,
                }}
              >
                {idx < 3 && (
                  <Avatar sx={{ bgcolor: medalColors[idx], color: '#fff', width: 48, height: 48, mb: 1, boxShadow: 2 }}>
                    <EmojiEventsIcon fontSize="large" />
                  </Avatar>
                )}
                <Typography variant="h6" fontWeight="700" noWrap>
                  {username}
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold" mt={1}>
                  {score} điểm
                </Typography>
                {idx < 3 && (
                  <Typography variant="subtitle2" color="text.secondary" mt={1}>
                    {idx === 0 ? 'Hạng nhất' : idx === 1 ? 'Hạng nhì' : 'Hạng ba'}
                  </Typography>
                )}
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* Khóa học nổi bật */}
      <Box>
        <Typography variant="h5" fontWeight="700" mb={3}>
          Khóa học nổi bật
        </Typography>
        <Grid container spacing={4}>
          {featuredCourses.map(
            ({ title, instructor, rating, price, img }, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={4}>
                <Paper
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                      transform: 'translateY(-4px) scale(1.03)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={img}
                    alt={title}
                    sx={{ width: "100%", height: 180, objectFit: "cover" }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="700"
                      gutterBottom
                    >
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Giảng viên: {instructor}
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <StarIcon sx={{ color: "#fbc02d", mr: 0.5 }} />
                      <Typography variant="body2" fontWeight="600">
                        {rating}⭐
                      </Typography>
                    </Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="700"
                      color="primary.main"
                      mb={2}
                    >
                      {price}
                    </Typography>
                    <Button variant="contained" fullWidth size="medium" sx={{ fontWeight: 700, borderRadius: 2 }}>
                      Xem chi tiết
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            )
          )}
        </Grid>
      </Box>
    </Box>
  );
}
