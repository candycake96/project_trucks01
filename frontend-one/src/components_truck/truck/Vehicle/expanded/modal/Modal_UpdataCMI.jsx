import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../../config/apiConfig";

const Modal_UpdateCMI = ({ isOpen, onClose, dataCMI }) => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [formData, setFormData] = useState({
        cmi_start: "",
        cmi_end: ""
    });

    useEffect(() => {
        if (dataCMI) {
            setFormData({
                cmi_start: dataCMI.cmi_start ? dataCMI.cmi_start.split("T")[0] : "",
                cmi_end: dataCMI.cmi_end ? dataCMI.cmi_end.split("T")[0] : ""
            })
        }
    }, [dataCMI])

    const handleSubmitUpdateCMI = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${apiUrl}/api/vehicle_updata_cmi/${dataCMI.reg_id}`,
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
        <>
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
                        พรบ (แก้ไข)
                    </div>
                    {/* Display success or error message */}
                    {message && (
                        <div
                            className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                        >
                            {message}
                        </div>
                    )}
                    <form onSubmit={handleSubmitUpdateCMI}>
                        <div className="mb-3">
                            <label htmlFor="input_cmi_start" className="form-label fw-medium">
                                วันที่เริ่มต้น <span style={{ color: "red" }}> *</span>
                            </label>
                            <input
                                type="date"
                                id="input_cmi_start"
                                name="cmi_start"
                                className="form-control"
                            value={formData.cmi_start}
                            onChange={(e) => setFormData({ ...formData, cmi_start: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="input_cmi_end" className="form-label fw-medium">
                                วันที่สิ้นสุด <span style={{ color: "red" }}> *</span>
                            </label>
                            <input
                                type="date"
                                id="input_cmi_end"
                                name="cmi_end"
                                className="form-control"
                            value={formData.cmi_end}
                            onChange={(e) => setFormData({ ...formData, cmi_end: e.target.value })}
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
        </>
    )
}

export default Modal_UpdateCMI;