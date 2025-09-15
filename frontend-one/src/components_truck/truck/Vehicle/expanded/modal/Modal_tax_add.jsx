import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../../config/apiConfig";

const Modal_tax_add = ({ isOpen, onClose, dataVehicle, onSaved  }) => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [formData, setFormData] = useState({
        tax_date_end: "",
        price: "",
        tax_doc: null, // เก็บไฟล์
    });

    // โหลดค่าเดิมเข้ามา
    useEffect(() => {
        if (dataVehicle) {
            setFormData((prev) => ({
                ...prev,
                tax_date_end: dataVehicle.tax_end ? dataVehicle.tax_end.split("T")[0] : "",
                price: dataVehicle.price || "",
            }));
        }
    }, [dataVehicle]);

    // handle input change
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "tax_doc") {
            setFormData((prev) => ({ ...prev, tax_doc: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // submit
    const handleSubmitTaxAdd = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("price", formData.price);
            formDataToSend.append("tax_date_end", formData.tax_date_end);
            if (formData.tax_doc) {
                formDataToSend.append("tax_doc", formData.tax_doc);
            }

            const response = await axios.post(
                `${apiUrl}/api/tax_add/${dataVehicle.reg_id}`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setMessage(response.data.message || "อัปเดตข้อมูลภาษีสำเร็จ!");
            setMessageType("success");
            alert("อัปเดตข้อมูลภาษีสำเร็จ!");
                        // ✅ แจ้ง parent component ให้โหลดข้อมูลใหม่
            if (onSaved) {
                onSaved(response.data);
            }

            onClose();
            
        } catch (error) {
            console.error("Error updating Tax:", error);
            setMessage("Error updating Tax");
            setMessageType("error");
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="แก้ไขข้อมูลภาษี"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "650px",
                    margin: "auto",
                    padding: "20px",
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
            <div>
                <h5 className="text-center mb-3 fw-bold">แก้ไขข้อมูลภาษี</h5>

                {/* success/error message */}
                {message && (
                    <div
                        className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmitTaxAdd}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="tax_date_end" className="form-label fw-medium">
                                วันที่สิ้นสุด <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="date"
                                id="tax_date_end"
                                name="tax_date_end"
                                value={formData.tax_date_end}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="price" className="form-label fw-medium">
                                ราคา <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="tax_doc" className="form-label fw-medium">
                            อัพโหลดเอกสารภาษี
                        </label>
                        <input
                            type="file"
                            id="tax_doc"
                            name="tax_doc"
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-success me-2">
                            บันทึก
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
};

export default Modal_tax_add;
