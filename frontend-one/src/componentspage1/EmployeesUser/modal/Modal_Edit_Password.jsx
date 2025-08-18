import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../config/apiConfig";


const Modal_Edit_Password = ({ isOpen, onClose, onData }) => {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setFormData({ password: "", confirmPassword: "" });
            setShowPassword(false);
            setErrors({});
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        const { password, confirmPassword } = formData;

        if (!password) {
            newErrors.password = "กรุณากรอกรหัสผ่าน";
        } else if (password.length < 6) {
            newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            if (user && user.id_emp) {
                try {
                    const token = localStorage.getItem("accessToken"); // ✅ ดึง token
                    const response = await axios.put(
                        `${apiUrl}/api/password_update/${user.id_emp}`,
                        {
                            password: formData.password,
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    alert("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
                    onClose();
                } catch (error) {
                    console.error("เปลี่ยนรหัสผ่านล้มเหลว:", error);
                    alert("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
                }
            } else {
                alert("ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
            }
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="เปลี่ยนรหัสผ่าน"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "500px",
                    height: "400px",
                    margin: "auto",
                    padding: "30px",
                    borderRadius: "10px",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                },
            }}
        >
            <div className="text-center mb-4">
                <h5 className="fw-bold">เปลี่ยนรหัสผ่านเข้าใช้งาน</h5>
            </div>

            <div className="mb-3">
                <label htmlFor="password" className="form-label fw-medium">
                    รหัสผ่านใหม่
                </label>
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-medium">
                    ยืนยันรหัสผ่าน
                </label>
                <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            <div className="form-check mb-3">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="showPasswordCheckbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                />
                <label className="form-check-label" htmlFor="showPasswordCheckbox">
                    แสดงรหัสผ่าน
                </label>
            </div>

            <button className="btn btn-primary w-100" onClick={handleSubmit}>
                <i className="bi bi-save me-2"></i>บันทึกรหัสผ่าน
            </button>
        </ReactModal>
    );
};

export default Modal_Edit_Password;
