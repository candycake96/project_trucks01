import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";  // นำเข้า useNavigate และ useLocation
import "./LoginTruck.css";
import { apiUrl } from "../config/apiConfig";

const LoginTruck = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();  // ใช้ navigate
  const location = useLocation();  // ใช้ location เพื่อตรวจสอบ path ที่ผู้ใช้ต้องการไป

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  if (!formData.email || !formData.password) {
    setError("กรุณากรอก Email และ Password");
    setLoading(false);
    return;
  }

  try {
    const response = await axios.post(`${apiUrl}/api/logintruck`, formData); // API call
    const { accessToken, user } = response.data;

    // Store token and user info in localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    alert("เข้าสู่ระบบสำเร็จ!");

    // Redirect ไปยังหน้าที่ผู้ใช้พยายามเข้าถึง (ถ้ามี) หรือหน้า default เช่น /truck
    const redirectPath = location.state?.from?.pathname || "/truck"; // ถ้ามีจากหน้าเดิม ก็ไปที่หน้านั้น
    console.log("Redirecting to:", redirectPath); // ดูค่าใน console ว่าได้ path ที่ต้องการหรือไม่
    navigate(redirectPath, { replace: true }); // ใช้ navigate เพื่อนำทางไปยัง path ที่ต้องการ
  } catch (error) {
    setError(error.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="fw-bolder fs-2 mb-3">
          <i className="bi bi-truck"></i> Truck Login
        </h1>
        <hr className="mb-3" />

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPasswordCheck"
              checked={showPassword}
              onChange={toggleShowPassword}
            />
            <label className="form-check-label" htmlFor="showPasswordCheck">
              Show Password
            </label>
          </div>
        </div>

        <button type="submit" className="login-button mb-3" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
        <div className="">
          <p><a href="" className="link" style={{color: "#008080"}}>ลืมรหัสผ่าน?</a></p>
        
      </div>
      </form>

    </div>
  );
};

export default LoginTruck;
