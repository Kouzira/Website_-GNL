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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { authApi } from "../../api/auth";

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

export default function Register({ direction, setDirection, toggleForm, darkMode }) {
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [regErrors, setRegErrors] = useState({});

  const validateRegister = () => {
    let temp = {};
    temp.regUsername = regUsername ? "" : "Vui lòng nhập tên đăng nhập";
    temp.regPassword =
      regPassword.length >= 6 ? "" : "Mật khẩu tối thiểu 6 ký tự";
    temp.regConfirm =
      regConfirm === regPassword ? "" : "Mật khẩu xác nhận không khớp";
    setRegErrors(temp);
    return Object.values(temp).every((x) => x === "");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateRegister()) return;

    setLoading(true);
    try {
      await authApi.register(regUsername, regPassword);
      alert("Đăng ký thành công!");
      toggleForm();
      setRegUsername("");
      setRegPassword("");
      setRegConfirm("");
      setRegErrors({});
    } catch (err) {
      setError(err.message || "Lỗi đăng ký, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="register"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <Stack spacing={3} sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, textAlign: "center" }}
        >
          Đăng ký
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" noValidate autoComplete="off" onSubmit={handleRegisterSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Tên đăng nhập"
              variant="outlined"
              fullWidth
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              error={Boolean(regErrors.regUsername)}
              helperText={regErrors.regUsername}
              autoFocus
              sx={{ "& .MuiInputBase-root": { borderRadius: 3 } }}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              error={Boolean(regErrors.regPassword)}
              helperText={regErrors.regPassword}
              sx={{ "& .MuiInputBase-root": { borderRadius: 3 } }}
            />
            <TextField
              label="Xác nhận mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              value={regConfirm}
              onChange={(e) => setRegConfirm(e.target.value)}
              error={Boolean(regErrors.regConfirm)}
              helperText={regErrors.regConfirm}
              sx={{ "& .MuiInputBase-root": { borderRadius: 3 } }}
            />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              startIcon={<PersonAddIcon />}
              disabled={loading}
              type="submit"
              sx={{
                borderRadius: 3,
                fontWeight: "700",
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(216, 27, 96, 0.4)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(216, 27, 96, 0.6)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Đăng ký"}
            </Button>
          </Stack>
        </Box>

        <Divider />

        <Typography
          variant="body2"
          align="center"
          sx={{
            cursor: "pointer",
            color: "secondary.main",
            userSelect: "none",
            fontWeight: 500,
          }}
          onClick={() => {
            setDirection(-1);
            toggleForm();
          }}
        >
          Đã có tài khoản? Đăng nhập
        </Typography>
      </Stack>
    </motion.div>
  );
}