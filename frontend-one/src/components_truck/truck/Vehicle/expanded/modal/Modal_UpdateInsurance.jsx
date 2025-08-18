import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../../config/apiConfig";

const Modal_UpdateInsurance = ({isOpen, onClose, dataInsurance}) => {
        const [message, setMessage] = useState("");
        const [messageType, setMessageType] = useState("");
        const [formData, setFormData] = useState({
            insurance_start: "",
            insurance_end: "",
            insurance_name: ""
        });

            useEffect(() => {
                if (dataInsurance) {
                    setFormData({
                        insurance_start: dataInsurance.insurance_start ? dataInsurance.insurance_start.split("T")[0] : "",
                        insurance_end: dataInsurance.insurance_end ? dataInsurance.insurance_end.split("T")[0] : "",
                        insurance_name: dataInsurance.insurance_name
                    })
                }
            }, [dataInsurance]);

            const handleSubmitUpdateInsurance = async (e) => {
                e.preventDefault();
                try {
                    const response = await axios.put(
                        `${apiUrl}/api/vehicle_updata_insurance/${dataInsurance.reg_id}`,
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
                    console.error("Error updating Insurance :", error);
                    setMessage("Error updating Insurance ");
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
                    <div className="text-center mb-3 fw-bolder">
                        ประกันภัย (แก้ไข)
                    </div>
                    {/* Display success or error message */}
                    {message && (
                        <div
                            className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                        >
                            {message}
                        </div>
                    )}
                    <form onSubmit={handleSubmitUpdateInsurance}>
                        <div className="mb-3">
                            <label htmlFor="input_insurance_start" className="form-label fw-medium">
                                วันที่เริ่มต้น <span style={{ color: "red" }}> *</span>
                            </label>
                            <input
                                type="date"
                                id="input_insurance_start"
                                name="insurance_start"
                                className="form-control"
                            value={formData.insurance_start}
                            onChange={(e) => setFormData({ ...formData, insurance_start: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="input_insurance_end" className="form-label fw-medium">
                                วันที่สิ้นสุด <span style={{ color: "red" }}> *</span>
                            </label>
                            <input
                                type="date"
                                id="input_insurance_end"
                                name="insurance_end"
                                className="form-control"
                            value={formData.insurance_end}
                            onChange={(e) => setFormData({ ...formData, insurance_end: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="input_insurance_name" className="form-label fw-medium">
                                ชื่อบริษัทประกัน <span style={{ color: "red" }}> *</span>
                            </label>
                            <input
                                type="text"
                                id="input_insurance_name"
                                name="insurance_name"
                                className="form-control"
                            value={formData.insurance_name}
                            onChange={(e) => setFormData({ ...formData, insurance_name: e.target.value })}
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

export default Modal_UpdateInsurance;