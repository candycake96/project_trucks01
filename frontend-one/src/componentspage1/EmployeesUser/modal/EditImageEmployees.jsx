import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";

const EditImageEmployees = ({ isOpen, onClose, emp, employeeId }) => {
    const [previewImageEmp, setPreviewImageEmp] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null); // สถานะสำหรับข้อความผิดพลาด

    // อัปเดต preview เมื่อ emp เปลี่ยนค่า
    useEffect(() => {
        if (emp?.image) {
            setPreviewImageEmp(`/uploads/${emp.image}`);
        } else {
            setPreviewImageEmp(null);
        }
    }, [emp]);

    // ฟังก์ชันจัดการการอัปโหลดรูป
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImageEmp(imageUrl); // อัปเดต previewImageEmp เมื่อเลือกรูป

            // สร้าง FormData สำหรับส่งข้อมูลไปยังเซิร์ฟเวอร์
            const formData = new FormData();
            formData.append("image", file); // เพิ่มไฟล์ลงใน FormData

            // ส่งข้อมูลไปยังเซิร์ฟเวอร์ด้วย Axios หรือ fetch.
            try {
                // ตัวอย่างใช้ Axios
                axios.put(`${apiUrl}/api/employeesputimage/${emp.id_emp}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                })
                .then((response) => {
                    console.log("Image uploaded successfully:", response.data);
                    setErrorMessage(null); // ล้างข้อความผิดพลาดเมื่ออัปโหลดสำเร็จ
                })
                .catch((error) => {
                    console.error("Error uploading image:", error);
                    setErrorMessage("ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่."); // แสดงข้อความผิดพลาด
                });
            } catch (error) {
                console.error("Error during image upload:", error);
                setErrorMessage("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ."); // แสดงข้อความผิดพลาด
            }
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Edit Employee"
            style={{
                content: {
                    width: "90%",
                    maxWidth: "500px",
                    height: "500px",
                    margin: "auto",
                    padding: "20px",
                    border: "none",
                    borderRadius: "10px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9999,
                },
            }}
        >
            <div className="mb-3">
                <p><i className="bi bi-image-fill"></i> กรุณาเลือกรูปภาพ </p>
            </div>

            <div style={{ textAlign: "center" }} className="mb-3">
                <div
                    style={{
                        position: "relative",
                        width: "250px",
                        height: "250px",
                        borderRadius: "50%",
                        border: "3px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "auto",
                        overflow: "hidden",
                        backgroundColor: "#f8f8f8",
                    }}
                >
                    {previewImageEmp ? (
                        <img
                            src={previewImageEmp}
                            alt="Preview"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                position: "absolute",
                            }}
                        />
                    ) : (
                        <span style={{ color: "#aaa", fontSize: "14px" }}>No Image</span>
                    )}

                    {/* ปุ่มอัปโหลดรูป */}
                    <label
                        htmlFor={`image-upload-${employeeId}`} // ให้ id เป็น unique ตาม employeeId
                        style={{
                            position: "absolute",
                            bottom: "20px",
                            right: "20px",
                            backgroundColor: "#f4d03f",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "60px",
                            height: "60px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                            fontSize: "20px",
                        }}
                    >
                        +
                    </label>

                    <input
                        id={`image-upload-${employeeId}`} // ให้ id เป็น unique ตาม employeeId
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                    />
                </div>
            </div>

            {/* แสดงข้อความผิดพลาด */}
            {errorMessage && (
                <div style={{ color: "red", marginBottom: "15px" }}>
                    <p>{errorMessage}</p>
                </div>
            )}

            <div>
                <button 
                    className="btn" 
                    style={{ background: "#4CAF50", color: "white", borderRadius: "5px" }}
                    onClick={onClose} // ปิด modal เมื่อคลิกปุ่มบันทึก
                >
                    บันทึก 
                </button>
            </div>
        </Modal>
    );
};

export default EditImageEmployees;
