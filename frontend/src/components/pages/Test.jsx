import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const categoriesData = {
  "Sử dụng ngôn ngữ": ["Tiếng Việt", "Tiếng Anh"],
  "Toán học": ["Toán học"],
  "Tư duy khoa học": ["Logic", "Phân tích số liệu", "Suy luận khoa học"],
};

export default function Test() {
  const [selectedFields, setSelectedFields] = useState({});
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra đã đăng nhập chưa
  const isLoggedIn = () => !!localStorage.getItem("accessToken"); // sửa lại key token đúng với app của bạn

  // Kiểm tra đăng nhập trước khi gọi callback
  const checkAndNavigate = (callback) => {
    if (!isLoggedIn()) {
      setOpenLoginDialog(true);
      return;
    }
    callback();
  };

  const handleStartFullExam = () => {
    checkAndNavigate(() => {
      const allCategories = Object.entries(categoriesData).map(
        ([category, subcategories]) => ({
          category,
          subcategories,
        })
      );
      navigate("/exam", { state: { selectedCategories: allCategories } });
    });
  };

  const handleStartPartialExam = () => {
    checkAndNavigate(() => {
      const filtered = Object.entries(selectedFields)
        .filter(([, subs]) => subs.length > 0)
        .map(([category, subcategories]) => ({ category, subcategories }));
      if (filtered.length === 0) {
        alert("Vui lòng chọn ít nhất một lĩnh vực để thi");
        return;
      }
      navigate("/exam", { state: { selectedCategories: filtered } });
    });
  };

  const handleCheckboxChange = (category, subcategory) => (event) => {
    setSelectedFields((prev) => {
      const prevCategory = prev[category] || [];
      if (event.target.checked) {
        return { ...prev, [category]: [...prevCategory, subcategory] };
      } else {
        return {
          ...prev,
          [category]: prevCategory.filter((item) => item !== subcategory),
        };
      }
    });
  };

  return (
    <>
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, px: 2 }}>
        <Typography variant="h4" gutterBottom>
          Chọn kiểu thi
        </Typography>

        <Paper
          variant="outlined"
          sx={{ p: 3, mb: 4, backgroundColor: "background.paper" }}
        >
          <Typography variant="h6" gutterBottom>
            Thi đầy đủ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bao gồm tất cả các lĩnh vực
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleStartFullExam}
          >
            Bắt đầu thi
          </Button>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thi từng phần
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Chọn một hoặc nhiều lĩnh vực để thi
          </Typography>

          {Object.entries(categoriesData).map(([category, subcategories]) => (
            <Box key={category} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {category}
              </Typography>
              <FormGroup>
                {subcategories.map((subcat) => (
                  <FormControlLabel
                    key={subcat}
                    control={
                      <Checkbox
                        checked={
                          selectedFields[category]?.includes(subcat) || false
                        }
                        onChange={handleCheckboxChange(category, subcat)}
                      />
                    }
                    label={subcat}
                  />
                ))}
              </FormGroup>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Button
            variant="contained"
            onClick={handleStartPartialExam}
            disabled={Object.values(selectedFields).every(
              (arr) => arr.length === 0
            )}
          >
            Bắt đầu thi theo phần đã chọn
          </Button>
        </Paper>
      </Box>

      {/* Dialog thông báo đăng nhập */}
      <Dialog
        open={openLoginDialog}
        onClose={() => setOpenLoginDialog(false)}
      >
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>Bạn cần đăng nhập để được phép thi thử.</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoginDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenLoginDialog(false);
              navigate("/login");
            }}
          >
            Đăng nhập ngay
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}