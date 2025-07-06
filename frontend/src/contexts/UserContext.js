import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { refreshToken } from '../api/auth';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Lấy thông tin user từ access token đã decode
  const getUserInfoFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return {
        username: decoded.username || 'User',
        role: decoded.role || 'user',
        id: decoded.id,
      };
    } catch {
      return { username: 'User', role: 'user' };
    }
  };

  // Hàm gọi refresh token để lấy access token mới và cập nhật user context
  const refreshAccessToken = useCallback(async () => {
    try {
      const result = await refreshToken(); // Gọi api refresh token
      if (result.accessToken) {
        // Nếu backend trả về user kèm token
        const userData = result.user || getUserInfoFromToken(result.accessToken);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Không có token thì xóa user và token khỏi storage
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }, []);

  useEffect(() => {
    refreshAccessToken();
  }, [refreshAccessToken]);

  // Ghi user khi login thành công
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Xóa user và token khi logout
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        await axios.post('http://localhost:4000/api/auth/logout', { refreshToken });
      }

      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      // Dù lỗi cũng xóa token, logout client
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}