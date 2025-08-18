import axios from "axios";
import React, { useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../config/apiConfig";

const Modal_Company_add = ({ isOpen, onClose }) => {
    const [isCompany, setCompany] = useState({
        company_name: "",
        company_address: "",
        company_logo: null
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleFileChangeLogo = (e) => {
        setCompany({ ...isCompany, company_logo: e.target.files[0] });
    };

    const handleSubmitCompanyAdd = async (e) => {
        e.preventDefault();

        const formDataCompany = new FormData();
        const token = localStorage.getItem("accessToken");
        console.log('FormData before submission:', isCompany);
        // Append fields to FormData
        formDataCompany.append("formDataCompany", JSON.stringify(isCompany));
        if (isCompany.company_logo) {
            formDataCompany.append("company_logo", isCompany.company_logo);
        }
        console.log("FormData to be sent:", Object.fromEntries(formDataCompany.entries()));
        
        try {
            const response = await axios.post(
                `${apiUrl}/api/addcompany`,
                formDataCompany,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Response from the server:", response.data);

            setMessage(response.data.message || "เพิ่มข้อมูลสำเร็จ!");
            setMessageType("success");

            // รีเซ็ตฟอร์มหลังจากบันทึกสำเร็จ
            setCompany({
                company_name: "",
                company_address: "",
                company_logo: null
            });

            onClose(); // ปิด Modal หลังจากบันทึก
        } catch (error) {
            console.error("Upload Error:", error.response ? error.response.data : error.message);
            setMessage(error.response ? error.response.data.message : "เกิดข้อผิดพลาดในการเพิ่มบริษัท");
            setMessageType("error");
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="เพิ่มข้อมูลองค์กรใหม่"
            style={{
                content: {
                    width: "90%",
                    maxWidth: "600px",
                    maxHeight: "80vh",
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
                <div className="d-flex justify-content-between align-items-center">
                    <p className="fw-bolder mx-auto">เพิ่มข้อมูลองค์กรใหม่</p>
                    <button onClick={onClose} className="btn-close"></button>
                </div>

                {message && (
                    <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmitCompanyAdd}>
                    <div className="col-lg-12 mb-3">
                        <label htmlFor="input_company_name" className="form-label fw-medium">
                            ชื่อองค์กร
                        </label>
                        <input
                            name="company_name"
                            type="text"
                            id="input_company_name"
                            className="form-control"
                            value={isCompany.company_name}
                            onChange={(e) => setCompany({ ...isCompany, company_name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="col-lg-12 mb-3">
                        <label htmlFor="input_company_address" className="form-label fw-medium">
                            ที่อยู่ (ถ้ามี)
                        </label>
                        <textarea
                            name="company_address"
                            id="input_company_address"
                            className="form-control"
                            rows="4"
                            value={isCompany.company_address}
                            onChange={(e) => setCompany({ ...isCompany, company_address: e.target.value })}
                        />
                    </div>

                    <div className="col-lg-12 mb-3">
                        <label htmlFor="input_company_logo" className="form-label fw-medium">
                            รูปโลโก้บริษัท
                        </label>
                        <input
                            name="company_logo"
                            type="file"
                            id="input_company_logo"
                            className="form-control"
                            onChange={handleFileChangeLogo}
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
};

export default Modal_Company_add;
