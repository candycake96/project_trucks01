import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../../config/apiConfig";
import axios from "axios";
import ReactModal from "react-modal";

const Modal_nisurance_add = ({ isOpen, onClose, dataCar, onSuccess }) => {
    if (!dataCar) return null;

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [insuranceTypes, setInsuranceTypes] = useState([]);
    const [insuranceClass, setInsuranceClass] = useState([]);
    const [formData, setFormData] = useState({
        class_id: "",
        coverage_id: "",
        insurance_company: "",
        insurance_start_date: "",
        insurance_end_date: "",
        insurance_converage_amount: "",
        insurance_premium: "",
        insurance_file: null, // แก้ชื่อให้ตรงกับ backend
    });

    const fetchInsuranceClass = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/car_insurance_coverage_type`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setInsuranceTypes(response.data);
        } catch (error) {
            console.error("Error fetching coverage type:", error);
        }
    };

    const fetchInsuranceTypes = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/car_insurance_class`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setInsuranceClass(response.data);
        } catch (error) {
            console.error("Error fetching insurance class:", error);
        }
    };

    useEffect(() => {
        fetchInsuranceClass();
        fetchInsuranceTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileInsurance = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 2 * 1024 * 1024) {
            setFormData((prev) => ({
                ...prev,
                insurance_file: file,
            }));
        } else {
            alert("ไฟล์ต้องมีขนาดไม่เกิน 2MB");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('FormData before submission:', formData);

        const payload = new FormData();
        

        Object.keys(formData).forEach((key) => {
            if (key === "file_download" && formData[key]) {
                payload.append(key, formData[key]);
            } else if (key !== "file_download") {
                payload.append(key, formData[key]);
            }
        });

        console.log("payload to be sent:", payload);
        payload.append('formData', JSON.stringify(formData)); // ใช้ JSON.stringify()

        try {
            const response = await axios.post(
                `${apiUrl}/api/car_insurance_add/${dataCar.reg_id}`,
                payload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            alert("บันทึกสำเร็จ");
            if (onSuccess) onSuccess(); // เรียกแบบ callback ธรรมดา
            setMessage(response.data.message || "บันทึกข้อมูลสำเร็จ");
            setMessageType("success");
            setFormData({
                class_id: "",
                coverage_id: "",
                insurance_company: "",
                insurance_start_date: "",
                insurance_converage_amount: "",
                insurance_end_date: "",
                  insurance_premium: "",
                insurance_file: null, // แก้ชื่อให้ตรงกับ backend
            });

            onClose()
            
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการส่งข้อมูล", error);
            alert("เกิดข้อผิดพลาดในการบันทึก");
            setMessage("ไม่สามารถบันทึกข้อมูลได้");
            setMessageType("error");
        }
    };

    return (
  <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            // contentLabel="แก้ไขข้อมูล"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "950px",
                    maxHeight: "65vh",
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
            <div className="p-3">
                <div className="mb-3">
                    <p className="fw-bolder">เพิ่มข้อมูลประกันทะเบียนรถ {dataCar.reg_number}</p>
                </div>

                {message && (
                    <div className="p-1">
                        <div
                            className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                            style={{
                                backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                                color: messageType === "success" ? "#155724" : "#721c24",
                                border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                            }}
                        >
                            {message}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label className="form-label fw-medium">วันที่เริ่มต้น <span style={{ color: "red" }}>*</span></label>
                            <input
                                type="date"
                                name="insurance_start_date"
                                className="form-control"
                                value={formData.insurance_start_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label className="form-label fw-medium">วันที่หมดอายุ <span style={{ color: "red" }}>*</span></label>
                            <input
                                type="date"
                                name="insurance_end_date"
                                className="form-control"
                                value={formData.insurance_end_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-lg-12">
                            <label className="form-label fw-medium">บริษัทประกันภัย <span style={{ color: "red" }}>*</span></label>
                            <input
                                type="text"
                                name="insurance_company"
                                className="form-control"
                                value={formData.insurance_company}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-3 mb-3">
                            <label className="form-label fw-medium">จำนวนเงินคุ้มครอง <span style={{ color: "red" }}>*</span></label>
                            <input
                                type="text"
                                name="insurance_converage_amount"
                                className="form-control"
                                value={formData.insurance_converage_amount}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-lg-3 mb-3">
                            <label className="form-label fw-medium">เบี้ยประกัน <span style={{ color: "red" }}>*</span></label>
                            <input
                                type="text"
                                name="insurance_premium"
                                className="form-control"
                                value={formData.insurance_premium}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-lg-3 mb-3">
                            <label className="form-label fw-medium">ประเภทการคุ้มครอง <span style={{ color: "red" }}>*</span></label>
                            <select
                                className="form-select"
                                name="coverage_id"
                                value={formData.coverage_id}
                                onChange={handleChange}
                            >
                                <option value="">เลือก</option>
                                {insuranceTypes.map((row, index) => (
                                    <option key={index} value={row.id}>
                                        {row.coverage_type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-lg-3 mb-3">
                            <label className="form-label fw-medium">ชั้นประกัน</label>
                            <select
                                className="form-select"
                                name="class_id"
                                value={formData.class_id}
                                onChange={handleChange}
                            >
                                <option value="">เลือก</option>
                                {insuranceClass.map((row, index) => (
                                    <option key={index} value={row.id}>
                                        {row.insurance_class}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-medium">เอกสารเพิ่มเติม <span style={{ color: "red" }}>*</span></label>
                            <input
                                type="file"
                                name="insurance_file"
                                className="form-control"
                                onChange={handleFileInsurance}
                            />
                        </div>
                    </div>

                    <div className="text-center mb-2">
                        <button className="btn btn-primary me-2" type="submit">บันทึก</button>
                        <button className="btn btn-danger" onClick={onClose}>ยกเลิก</button>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
};

export default Modal_nisurance_add;
