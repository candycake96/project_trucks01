import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../../config/apiConfig";


const Modal_act_add = ({ isOpen, onClose, dataVehicle, onSaved }) => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [formData, setFormData] = useState({
        act_date_start: "",
        act_date_end: "",
        price: "",
        act_doc: null,
    });

    // โหลดค่าเดิมเข้ามา
    useEffect(() => {
        if (dataVehicle) {
            setFormData((prev) => ({
                ...prev,
                act_date_start: dataVehicle.act_start ? dataVehicle.act_start.split("T")[0] : "",
                act_date_end: dataVehicle.act_end ? dataVehicle.act_end.split("T")[0] : "",
                price: dataVehicle.price || "",
            }));
        }
    }, [dataVehicle]);

    // handle input change
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "act_doc") {
            setFormData((prev) => ({ ...prev, act_doc: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // submit
    const handleSubmitActAdd = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("price", formData.price);
            formDataToSend.append("act_date_start", formData.act_date_start);
            formDataToSend.append("act_date_end", formData.act_date_end);
            if (formData.act_doc) {
                formDataToSend.append("act_doc", formData.act_doc);
            }

            const response = await axios.post(
                `${apiUrl}/api/act_add/${dataVehicle.reg_id}`,
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

            if (onSaved) {
                onSaved(response.data);
            }

            onClose();
        } catch (error) {
            console.error("Error updating act:", error);
            setMessage("Error updating act");
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
                        className={`alert ${
                            messageType === "success" ? "alert-success" : "alert-danger"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmitActAdd}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="act_date_start" className="form-label fw-medium">
                                วันที่เริ่มต้น <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="date"
                                id="act_date_start"
                                name="act_date_start"
                                value={formData.act_date_start}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="act_date_end" className="form-label fw-medium">
                                วันที่สิ้นสุด <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="date"
                                id="act_date_end"
                                name="act_date_end"
                                value={formData.act_date_end}
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
                        <label htmlFor="act_doc" className="form-label fw-medium">
                            อัพโหลดเอกสารภาษี
                        </label>
                        <input
                            type="file"
                            id="act_doc"
                            name="act_doc"
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

export default Modal_act_add;
