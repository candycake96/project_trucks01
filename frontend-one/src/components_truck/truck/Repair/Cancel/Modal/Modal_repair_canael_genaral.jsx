import axios from "axios";
import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../../config/apiConfig";

const Modal_repair_cancel_ganaral = ({ isOpen, onClose, dataClosing, user }) => {
    const [formData, setFormData] = useState({
        close_date: "",
        close_remark: "",
        status_after_close: ""
    });


    useEffect(() => {
    if (!formData.close_date) {
        const today = new Date().toISOString().split("T")[0];
        setFormData(prev => ({ ...prev, close_date: today }));
    }
}, [dataClosing]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "close_file") {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0], // เก็บเป็นไฟล์
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmitClose = async () => {
        try {
            const form = new FormData();
            form.append("request_id", dataClosing?.request_id);
            form.append("close_date", formData.close_date);
            form.append("close_remark", formData.close_remark);
            form.append("status_after_close", formData.status_after_close);
            if (formData.close_file) {
                form.append("close_file", formData.close_file);
            }

            console.log("ข้อมูลที่แนบ:");
            for (let [key, value] of form.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await axios.post(
                `${apiUrl}/api/close_list_add/${user?.id_emp}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("✅ ส่งข้อมูลสำเร็จ:", response.data);
            onClose(); // ปิด modal หลังส่งสำเร็จ
        } catch (error) {
            console.error("❌ ส่งข้อมูลไม่สำเร็จ:", error);
        }
    };




    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="ปิดงานซ่อม"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "700px",
                    maxHeight: "600px",
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
            {/* Header */}
            <div
                className="modal-header"
                style={{
                    padding: "1rem",
                    backgroundColor: "#f8f9fa",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                }}
            >
                <h5 className="modal-title fw-bold">ยกเลิกงานซ่อม </h5>
                <button
                    onClick={onClose}
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        cursor: "pointer",
                    }}
                >
                    ×
                </button>
            </div>

            {/* Body */}
            <div className="p-4">
                <div className="mb-3">
                    <label className="form-label fw-semibold">วันที่ปิดงาน</label>
                    <input
                        type="date"
                        className="form-control"
                        name="close_date"
                        value={formData.close_date}
                        onChange={handleChange}
                        disabled
                    />
                </div>


                <div className="mb-3">
                    <label className="form-label fw-semibold">สถานะหลังปิดงาน</label>
                    <select
                        className="form-select"
                        name="status_after_close"
                        value={formData.status_after_close}
                        onChange={handleChange}
                    >
                        <option value="">-- เลือกสถานะ --</option>
                        <option value="ยกเลิกงาน">ยกเลิกงานซ่อม</option>
                    </select>
                </div>


                <div className="mb-3">
                    <label className="form-label fw-semibold">เอกสารกาารปิดงานซ่อม</label>
                    <input
                        type="file"
                        className="form-control"
                        name="close_file"
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">หมายเหตุ</label>
                    <textarea
                        className="form-control"
                        name="close_remark"
                        rows="3"
                        placeholder="รายละเอียดหรืออุปกรณ์ที่เปลี่ยน"
                        value={formData.close_remark}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="modal-footer p-3 border-top d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={onClose}>
                    ยกเลิก
                </button>
                <button className="btn btn-success" onClick={handleSubmitClose}>
                    <i className="bi bi-check-circle me-1"></i> ยืนยันยกเลิกงานซ่อม
                </button>
            </div>
        </ReactModal>
    )
}

export default Modal_repair_cancel_ganaral;