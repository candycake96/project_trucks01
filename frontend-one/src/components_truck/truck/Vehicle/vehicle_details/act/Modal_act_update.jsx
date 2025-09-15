import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { apiUrl } from "../../../../../config/apiConfig";

const Modal_act_update = ({ isOpen, onClose, dataAct, onSaved }) => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [formData, setFormData] = useState({
        act_date_start: "",
        act_date_end: "",
        price: "",
        act_doc: null
    });

    useEffect(() => {
        if (dataAct) {
            const startDate = dataAct.act_date_start
                ? new Date(dataAct.act_date_start).toISOString().split("T")[0]
                : "";
            const endDate = dataAct.act_date_end
                ? new Date(dataAct.act_date_end).toISOString().split("T")[0]
                : "";

            setFormData({
                act_date_start: startDate,
                act_date_end: endDate,
                price: dataAct.price || "",
                act_doc: null, // ค่าเริ่มต้นเป็น null
            });
        }
    }, [dataAct]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "act_doc") {
            setFormData((prev) => ({ ...prev, act_doc: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmitUpdateAct = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = new FormData();
            dataToSend.append(
                "formData",
                JSON.stringify({
                    act_date_start: formData.act_date_start,
                    act_date_end: formData.act_date_end,
                    price: formData.price,
                    act_doc: dataAct.act_doc || null, // เก็บไฟล์เดิมถ้าไม่มีการอัปโหลดใหม่
                })
            );

            if (formData.act_doc) {
                dataToSend.append("act_doc", formData.act_doc);
            }

            await axios.put(
                `${apiUrl}/api/act_update/${dataAct.act_id}`,
                dataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setMessage("อัปเดตข้อมูล ACT สำเร็จ!");
            setMessageType("success");

            if (onSaved) onSaved(); // โหลดข้อมูลใหม่
            onClose();
        } catch (error) {
            console.error("Error updating ACT :", error);
            setMessage("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
            setMessageType("error");
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="แก้ไขข้อมูล ACT"
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
                <h5 className="text-center mb-3 fw-bold">แก้ไขข้อมูล พรบ.</h5>

                {message && (
                    <div
                        className={`alert ${
                            messageType === "success" ? "alert-success" : "alert-danger"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmitUpdateAct}>
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
                            อัพโหลดเอกสาร ACT
                        </label>
                        {dataAct?.act_doc && !formData.act_doc && (
                            <div className="mb-1">
                                <span className="text-danger">ไฟล์เดิม: </span>
                                <a href={dataAct.act_doc} target="_blank" rel="noopener noreferrer" className="text-danger">
                                    {dataAct.act_doc.split("/").pop()}
                                </a>
                            </div>
                        )}
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
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
};

export default Modal_act_update;
