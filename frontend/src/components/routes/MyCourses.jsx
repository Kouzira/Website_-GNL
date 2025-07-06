import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

export default function MyCourses() {
  // Giả sử dữ liệu khóa học lấy từ API hoặc context (ở đây tạm hardcode)
  const courses = [
    { id: 1, title: "Khóa học Toán căn bản" },
    { id: 2, title: "Khóa học Tiếng Anh giao tiếp" },
    { id: 3, title: "Lập trình React nâng cao" },
  ];

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 3 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Khóa học của tôi
        </Typography>

        {courses.length === 0 ? (
          <Typography>Chưa có khóa học nào</Typography>
        ) : (
          <List>
            {courses.map((course) => (
              <ListItem key={course.id} divider>
                <ListItemText primary={course.title} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
