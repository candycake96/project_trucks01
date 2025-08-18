import React, { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_vehicle_status_edit = ({isOpen, onClose, onData}) => {
    const [formData, setFormdata] = useState({
        status: "",
        status_annotation: "",
        file_status: null,
        status_active_date: "",
    });

    const fileInputRef = useRef(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false); // สำหรับสถานะ Loading

    // Reset ค่าใน Modal เมื่อเปิด
    useEffect(() => {
        if (isOpen) {
            setFormdata({
                status: "",
                status_annotation: "",
                file_status: null,
                status_active_date: "",
            });
            fileInputRef.current && (fileInputRef.current.value = "");
            setMessage("");
            setMessageType("");
            setErrorMessage("");
        }
    }, [isOpen]);

    // จัดการ File Upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // จำกัดไฟล์ที่ขนาดไม่เกิน 2MB
                setErrorMessage("ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 2MB)");
                return;
            }
            if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
                setErrorMessage("ประเภทไฟล์ไม่ถูกต้อง (รองรับเฉพาะ .jpeg, .png, .pdf)");
                return;
            }
            setFormdata((prev) => ({ ...prev, file_status: file }));
        }
    };

    // ฟังก์ชันบันทึกข้อมูล
    const handleSave = async () => {
        try {
            // ตรวจสอบ Validation
            if (!formData.status || !formData.status_active_date) {
                setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
                return;
            }
            if (!onData?.reg_id) {
                setErrorMessage("ไม่พบข้อมูลทะเบียนรถ");
                return;
            }

            const token = localStorage.getItem("accessToken");
            if (!token) {
                setErrorMessage("Access token is missing. Please log in again.");
                return;
            }

            // ตั้งสถานะ Loading
            setIsLoading(true);

            // จัดเตรียม FormData สำหรับส่งไป Backend
            const formDataObj = new FormData();
            formDataObj.append("status", formData.status);
            formDataObj.append("status_annotation", formData.status_annotation);
            formDataObj.append("status_active_date", formData.status_active_date);
            if (formData.file_status) {
                formDataObj.append("file_status", formData.file_status);
            }

            console.log("📤 Sending FormData:", Object.fromEntries(formDataObj.entries()));

            // ส่งข้อมูลไปยัง Backend
            const response = await axios.post(
                `${apiUrl}/api/vehicle_status_upddate/${onData.reg_id}`,

                formDataObj,
                { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
            );

            // แสดงข้อความสำเร็จ
            setMessage("Data saved successfully!");
            setMessageType("success");
 
                onClose();
           
        } catch (error) {
            console.error("❌ Error saving data:", error);
            setErrorMessage(error.response?.data?.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
            setIsLoading(false); // ปิด Loading
        }
    };
    return (
        <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose} // ป้องกันปิด Modal ขณะกำลังบันทึก
        ariaHideApp={false}
        contentLabel="Manage Vehicle Status"
        style={{
            content: {
                width: "100%",
                maxWidth: "950px",
                maxHeight: "60vh",
                height: "auto",
                margin: "auto",
                padding: "0",
                border: "none",
                borderRadius: "0.5rem",
                overflowY: "auto",
            },
            overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
        }}
        >
 <div className="p-4">
                <div className="text-center fw-bolder mb-3">
                    <p>จัดการสถานะรถทะเบียน: {onData?.reg_id || "-"}</p>
                </div>

                {message && (
                    <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="input_status" className="form-label fw-medium">สถานะ</label>
                        <select
                            className="form-select"
                            id="input_status"
                            name="status"
                            value={formData.status}
                            onChange={(e) => setFormdata({ ...formData, status: e.target.value })}
                        >
                            <option value="">กรุณาเลือก</option>
                            <option value="ม.79">ม.79</option>
                            <option value="ม.89">ม.89</option>
                            <option value="หาย">หาย</option>
                        </select>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="input_status_active_date" className="form-label fw-medium">วันที่มีผลบังคับใช้</label>
                        <input
                            type="date"
                            id="input_status_active_date"
                            name="status_active_date"
                            className="form-control"
                            value={formData.status_active_date}
                            onChange={(e) => setFormdata({ ...formData, status_active_date: e.target.value })}
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="input_file_status" className="form-label fw-medium">ไฟล์ข้อมูลเพิ่มเติม</label>
                        <input
                            type="file"
                            id="input_file_status"
                            name="file_status"
                            className="form-control"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="input_status_annotation" className="form-label fw-medium">หมายเหตุ</label>
                    <textarea
                        id="input_status_annotation"
                        name="status_annotation"
                        className="form-control"
                        value={formData.status_annotation}
                        onChange={(e) => setFormdata({ ...formData, status_annotation: e.target.value })}
                    ></textarea>
                </div>

                {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}

                <div className="text-center">
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isLoading} // ปิดปุ่มขณะกำลังบันทึก
                    >
                        {isLoading ? "กำลังบันทึก..." : "บันทึก"}
                    </button>
                </div>
            </div>
        </ReactModal>
    )
}

export default Modal_vehicle_status_edit;