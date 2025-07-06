import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: "absolute",
  }),
  center: { x: 0, opacity: 1, position: "relative" },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    position: "absolute",
  }),
};

export default function Login({ direction, setDirection, toggleForm }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(username, password);

      if (user.role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher-home");
      } else if (user.role === "student") {
        navigate("/main");
      } else {
        setError("Role không hợp lệ");
        // Bạn có thể gọi logout nếu muốn
        return;
      }
    } catch (err) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="login"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <Stack spacing={3} sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, textAlign: "center" }}>
          Đăng nhập
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" noValidate autoComplete="off" onSubmit={handleLoginSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Tên đăng nhập"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ "& .MuiInputBase-root": { borderRadius: 3 } }}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ "& .MuiInputBase-root": { borderRadius: 3 } }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              type="submit"
              sx={{
                borderRadius: 3,
                fontWeight: "700",
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(0, 123, 255, 0.4)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(0, 123, 255, 0.6)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Đăng nhập"}
            </Button>
          </Stack>
        </Box>

        <Divider />

        <Typography
          variant="body2"
          align="center"
          sx={{
            cursor: "pointer",
            color: "primary.main",
            userSelect: "none",
            fontWeight: 500,
          }}
          onClick={() => {
            setDirection(1);
            toggleForm();
          }}
        >
          Chưa có tài khoản? Đăng ký
        </Typography>
      </Stack>
    </motion.div>
  );
}