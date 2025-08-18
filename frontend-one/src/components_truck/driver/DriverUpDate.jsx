import React, { useState, useEffect } from "react";
import Modal from 'react-modal'; 
import axios from "axios";
import { apiUrl } from "../../config/apiConfig";

const DriverUpDate = ({ isOpenUpDate, onCloseUpDate, driverDataUpDate }) => {
    const [formData, setFormData] = useState(driverDataUpDate || {});
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        if (driverDataUpDate) {
            setFormData(driverDataUpDate);
        }
    }, [driverDataUpDate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `${apiUrl}/api/updatedriverlicense/${formData.id_driver}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setMessage(response.data.message);
            setMessageType("success");
            console.log(response.data);
            // Close modal after success
            // onCloseUpDate(); 
        } catch (error) {
            console.error("Error updating driver license:", error);
            setMessage("Error updating driver license");
            setMessageType("error");
        }
    };

    return (
        <Modal
            isOpen={isOpenUpDate}
            onRequestClose={onCloseUpDate}
            contentLabel="Update Driver Details"
            style={{
                content: {
                    width: "50%",
                    margin: "auto",
                    padding: "20px",
                },
            }}
        >
            <h2>อัพเดตข้อมูลใบอนุญาติการขับขี่ของพนักงาน</h2>
            
            {/* Display success or error message */}
            {message && (
                <div
                    className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                >
                    {message}
                </div>
            )}

            {driverDataUpDate ? (
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <label htmlFor="license_number" className="form-label">
                                รหัสใบขับขี่
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="license_number"
                                name="license_number"
                                value={formData.license_number || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <label htmlFor="name" className="form-label">
                                ชื่อ
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={`${formData.fname || ""} ${formData.lname || ""}`}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 mb-3">
                            <label htmlFor="issued_date" className="form-label">
                                วันที่ออกใบขับขี่
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="issued_date"
                                name="issued_date"
                                value={formData.issued_date || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label htmlFor="expiry_date" className="form-label">
                                วันที่หมดอายุใบขับขี่
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="expiry_date"
                                name="expiry_date"
                                value={formData.expiry_date || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label htmlFor="license_type" className="form-label">
                                ประเภทใบขับขี่
                            </label>
                            <select
                                className="form-select"
                                id="license_type"
                                name="license_type"
                                value={formData.license_type || ""}
                                onChange={handleInputChange}
                            >
                                <option value="">เลือกประเภทใบขับขี่</option>
                                <option value="บ.1">บ.1 รถยนต์ส่วนบุคคล</option>
                                <option value="บ.2">บ.2 รถบรรทุกส่วนตัว</option>
                                <option value="บ.3">บ.3 รถพ่วง รถเทรลเลอร์</option>
                                <option value="บ.4">บ.4 รถบรรทุกของไวไฟ</option>
                                <option value="ท.3">ท.3 รถพ่วง รถเทรลเลอร์ (การลากจูง)</option>
                                <option value="ท.4">ท.4 รถบรรทุกของไวไฟ</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="issuing_authority" className="form-label">
                            หน่วยงานที่ออกใบขับขี่
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="issuing_authority"
                            name="issuing_authority"
                            value={formData.issuing_authority || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="text-center">
                        <button
                            className="btn"
                            type="submit"
                            style={{ background: "#20c997", color: "#fff" }}
                        >
                            บันทึก
                        </button>
                    </div>
                </form>
            ) : (
                <p>ไม่มีข้อมูลผู้ขับรถที่เลือก</p>
            )}
            <button onClick={onCloseUpDate} className="btn btn-danger mt-3">
                ปิด
            </button>
        </Modal>
    );
};

export default DriverUpDate;
