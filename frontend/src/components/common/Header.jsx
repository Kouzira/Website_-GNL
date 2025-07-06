import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Stack,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/main");
  };

  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        bgcolor: "#222b45",
        color: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        borderBottom: "1px solid #222b45",
        zIndex: 1201,
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: { xs: 2, md: 6 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 3 }}>
          <img
            src="/logo192.png"
            alt="Logo"
            style={{ width: 32, height: 32, borderRadius: 0, filter: "brightness(0) invert(1)" }}
          />
          <Typography
            variant="h6"
            component={Link}
            to="/main"
            sx={{
              textDecoration: "none",
              color: "#fff",
              fontWeight: 900,
              letterSpacing: 1,
              fontSize: { xs: "1.1rem", md: "1.5rem" },
            }}
          >
            Đánh Giá Năng Lực
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#2e3650",
            px: 2,
            py: 0.5,
            borderRadius: 2,
            minWidth: 200,
            maxWidth: 320,
            mr: 2,
          }}
        >
          <SearchIcon sx={{ mr: 1, color: "#fff" }} />
          <InputBase
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "100%", color: "#fff" }}
          />
        </Box>
        <IconButton sx={{ ml: 1, color: "#fff" }}>
          <Badge color="error" variant="dot">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        {user ? (
          <>
            <IconButton onClick={handleMenu} sx={{ ml: 2 }}>
              <Avatar sx={{ bgcolor: "#fff", color: "#222b45", borderRadius: 2 }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: { mt: 1, minWidth: 180, boxShadow: 3, borderRadius: 0 },
              }}
            >
              <MenuItem component={Link} to="/userprofile">
                Hồ sơ
              </MenuItem>
              <MenuItem component={Link} to="/settings">
                Cài đặt
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error.main", fontWeight: 700 }}>
                Đăng xuất
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="inherit"
              sx={{ fontWeight: 700, borderRadius: 2, borderColor: "#fff", color: "#fff" }}
            >
              Đăng nhập
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Đăng ký
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}