import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";

export default function Settings({ darkMode, toggleDarkMode }) {
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleToggleEmailNotif = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handleSaveSettings = () => {
    // TODO: Gửi API lưu settings nếu cần
    alert("Đã lưu cài đặt!");
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Cài đặt
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={darkMode} onChange={toggleDarkMode} />
            }
            label="Chế độ tối"
          />

          <FormControlLabel
            control={
              <Switch
                checked={emailNotifications}
                onChange={handleToggleEmailNotif}
              />
            }
            label="Nhận thông báo qua email"
          />
        </FormGroup>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleSaveSettings}>
            Lưu cài đặt
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}