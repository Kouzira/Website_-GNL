import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './Login';
import Register from './Register';
import { Box } from '@mui/material';

const variants = {
  initial: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: (direction) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.4, ease: 'easeIn' },
  }),
};

export default function LoginPage({ darkMode, toggleDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [direction, setDirection] = useState(1);

  const isLoginPath = location.pathname === '/login';
  const [isLogin, setIsLogin] = useState(isLoginPath);

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const toggleForm = () => {
    setDirection(isLogin ? 1 : -1);
    if (isLogin) {
      navigate('/register');
    } else {
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 480,
        margin: 'auto',
        mt: 6,
        p: 4,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        position: 'relative',
      }}
    >
      <AnimatePresence exitBeforeEnter custom={direction}>
        {isLogin ? (
          <motion.div
            key="login"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: 'relative' }}
          >
            <Login
              direction={direction}
              setDirection={setDirection}
              toggleForm={toggleForm}
              darkMode={darkMode}
            />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: 'relative' }}
          >
            <Register
              direction={direction}
              setDirection={setDirection}
              toggleForm={toggleForm}
              darkMode={darkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
