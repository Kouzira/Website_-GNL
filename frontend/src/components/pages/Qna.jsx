import axios from "axios";

export default function TestRefreshToken() {
  const handleTest = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      console.log("Refresh token response:", res.data);
      alert("Gọi API thành công! Xem console để xem kết quả.");
    } catch (error) {
      console.error("Lỗi gọi API:", error.response?.data || error.message);
      alert("Gọi API thất bại! Xem console để xem lỗi.");
    }
  };

  return (
    <button onClick={handleTest} style={{ padding: "10px 20px", fontSize: 16 }}>
      Test Refresh Token API
    </button>
  );
}
