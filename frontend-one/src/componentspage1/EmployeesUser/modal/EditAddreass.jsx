import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { apiUrl } from "../../../config/apiConfig";

const EditAddress = ({ isOpen, onClose, row }) => {

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        country: '',
        postal_code: '',
        house_number: '',
        street: '',
        city: '',
        province: '',
    });

    // Update formData when row changes
    useEffect(() => {
        if (row) {
            setFormData({
                country: row.country || '',
                postal_code: row.postal_code || '',
                house_number: row.house_number || '',
                street: row.street || '',
                city: row.city || '',
                province: row.province || '',
            });
        }
    }, [row]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await axios.put(
                `${apiUrl}/api/putaddress/${row.address_id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setMessage(response.data.message);
            setMessageType("success");
            onClose(); // Close modal after success
        } catch (error) {
            console.error("Error saving Address data:", error);
            setMessage("Failed to update Address data.");
            setMessageType("error");
        } finally {
            setIsSaving(false);
        }
        onClose();  // Close modal after submission
    };

    if (!row) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Edit Employee"
            style={{
                content: {
                    width: "90%",
                    maxWidth: "800px",
                    height: "80%",
                    margin: "auto",
                    padding: "0",
                    border: "none",
                    borderRadius: "0.5rem",
                    overflowY: "auto",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9999,
                },
            }}
        >
            <div className="p-3">
                <div className="mb-3 text-center">
                    <p className="fs-5 fw-bold"><i className="bi bi-pencil-square"></i> แก้ไขที่อยู่ {row.address_id} </p>
                </div>

                <form onSubmit={handleSubmit}>
                     {/* Display success or error message */}
                     {message && (
                        <div
                            className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                        >
                            {message}
                        </div>
                    )}
                    <div>
                        <p className="fs-5 fw-bold">{row.address_type === "permanent" ? "ที่อยู่ตามบัตรประชาชน" : "ที่อยู่ปัจจุบัน"}</p>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 mb-3">
                            <label htmlFor="inputCountry">ประเทศ <span style={{ color: "red" }}> *</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="ประเทศ"
                            />
                        </div>
                        <div className="col-lg-3">
                            <label htmlFor="inputPostalCode">รหัสไปรษณีย์ <span style={{ color: "red" }}> *</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleChange}
                                placeholder="รหัสไปรษณีย์"
                            />
                        </div>
                    </div>
                    <div className="col-lg mb-3">
                        <label htmlFor="inputHouseNumber">ที่อยู่ <span style={{ color: "red" }}> *</span></label>
                        <input
                            type="text"
                            className="form-control"
                            name="house_number"
                            value={formData.house_number}
                            onChange={handleChange}
                            placeholder="ที่อยู่"
                        />
                    </div>
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor="inputStreet">ถนน/ตำบล <span style={{ color: "red" }}> *</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="ถนน/ตำบล"
                            />
                        </div>
                        <div className="col-lg-4">
                            <label htmlFor="inputCity">เมือง/อำเภอ <span style={{ color: "red" }}> *</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="เมือง/อำเภอ"
                            />
                        </div>
                        <div className="col-lg-4">
                            <label htmlFor="inputProvince">จังหวัด <span style={{ color: "red" }}> *</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                placeholder="จังหวัด"
                            />
                        </div>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-success">บันทึก</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>ยกเลิก</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditAddress;
