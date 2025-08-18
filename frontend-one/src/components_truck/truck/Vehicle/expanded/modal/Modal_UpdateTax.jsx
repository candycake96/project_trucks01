import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../../config/apiConfig";

const Modal_UpdateTex = ({ isOpen, onClose, dataTax }) => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [formData, setFormData] = useState({
        tax_end: "",
    });

    useEffect(() => {
        if (dataTax) {
            setFormData({
                tax_end: dataTax.tax_end ? dataTax.tax_end.split("T")[0] : ""
            });
        }
    }, [dataTax]);

    const handleSubmitUpdateTax = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${apiUrl}/api/vehicle_updata_tax/${dataTax.reg_id}`,
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

                    // ✅ แจ้งเตือนเมื่อสำเร็จ
        alert("อัปเดตข้อมูลภาษีสำเร็จ!");
        onClose();
        } catch (error) {
            console.error("Error updating Tax :", error);
            setMessage("Error updating Tax ");
            setMessageType("error");
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="แก้ไขข้อมูล"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "950px",
                    maxHeight: "50vh",
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
                <div className="text-center mb-3 fw-bolder">
                    ภาษีล่าสุด (แก้ไข)
                </div>
                {/* Display success or error message */}
                {message && (
                    <div
                        className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                    >
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmitUpdateTax}>
                    <div className="mb-3">
                        <label htmlFor="input_tax_end" className="form-label fw-medium">
                            วันที่สิ้นสุด <span style={{ color: "red" }}> *</span>
                        </label>
                        <input
                            type="date"
                            id="input_tax_end"
                            name="tax_end"
                            className="form-control"
                            value={formData.tax_end}
                            onChange={(e) => setFormData({ ...formData, tax_end: e.target.value })}
                        />
                    </div>
                    <div className="text-center mb-3">
                        <button type="submit" className="btn Teal-button">
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
};

export default Modal_UpdateTex;
