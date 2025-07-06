import React, { useState, useEffect } from "react";
import { Tabs, Tab, AppBar, Toolbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import ForumIcon from "@mui/icons-material/Forum";
import HelpIcon from "@mui/icons-material/Help";

const menuItems = [
  { label: "Thi thử", path: "/test", icon: <HomeIcon fontSize="small" /> },
  { label: "Khóa học", path: "/courselist", icon: <SchoolIcon fontSize="small" /> },
  { label: "Hỏi đáp", path: "/qna", icon: <ForumIcon fontSize="small" /> },
  { label: "Hỗ trợ", path: "/support", icon: <HelpIcon fontSize="small" /> },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = menuItems.findIndex((item) => item.path === location.pathname);
  const [tabIndex, setTabIndex] = useState(currentTab === -1 ? false : currentTab);

  useEffect(() => {
    setTabIndex(currentTab === -1 ? false : currentTab);
  }, [location.pathname, currentTab]);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
    navigate(menuItems[newValue].path);
  };

  return (
    <AppBar position="static" elevation={2} sx={{ bgcolor: "#fff", color: "primary.main", borderBottom: "1px solid #eee", borderRadius: 0 }}>
      <Toolbar sx={{ px: { xs: 1, sm: 3 }, minHeight: 48 }}>
        <Tabs
          value={tabIndex}
          onChange={handleChangeTab}
          textColor="primary"
          TabIndicatorProps={{
            style: {
              height: 3,
              borderRadius: 0,
              background: "linear-gradient(90deg, #338af3 0%, #5ee7df 100%)",
            },
          }}
          sx={{ width: "100%", minHeight: 40 }}
          variant="fullWidth"
        >
          {menuItems.map(({ label, icon }, idx) => (
            <Tab
              key={label}
              label={
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {icon}
                  {label}
                </span>
              }
              sx={{
                fontWeight: 700,
                textTransform: "none",
                fontSize: '1.05rem',
                minHeight: 36,
                px: 2,
                py: 0.5,
                color: tabIndex === idx ? "primary.main" : "#888",
                transition: 'all 0.2s',
                borderRadius: 0,
                '&:hover': {
                  color: "primary.main",
                  background: "#f5f7fa",
                },
              }}
            />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}