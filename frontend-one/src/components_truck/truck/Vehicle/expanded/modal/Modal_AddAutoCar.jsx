import { useState } from "react";
import axios from "axios";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../../config/apiConfig";

const Modal_AddAutoCar = ({ isOpen, onClose, regData }) => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [formData, setFormData] = useState({
        insurance_company: "",
        loan_amount: "",
        interest_rate: "",
        monthly_payment: "",
        start_date: "",
        end_date: "",
    });

    const handleSubmitAddAutoCar = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${apiUrl}/api/auto_car_add/${regData.reg_id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setMessage(response.data.message);
            setMessageType("success");
            alert("บันทึกข้อมูลสำเร็จ!");
            onClose();
            setFormData({
                insurance_company: "",
                loan_amount: "",
                interest_rate: "",
                monthly_payment: "",
                start_date: "",
                end_date: "",
            });
        } catch (error) {
            console.error("Error add Auto Car:", error);
            setMessage(
                error.response ? error.response.data.message : "Error add Auto Car"
            );
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
                <div className="text-center mb-3 fw-bolder">พรบ (แก้ไข)</div>
                {message && (
                    <div
                        className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"
                            }`}
                    >
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmitAddAutoCar}>
                    <div className="mb-3">
                        <label
                            htmlFor="input_insurance_company"
                            className="form-label fw-medium"
                        >
                            บริษัท <span style={{ color: "red" }}> *</span>
                        </label>
                        <input
                            type="text"
                            id="input_insurance_company"
                            name="insurance_company"
                            className="form-control"
                            value={formData.insurance_company}
                            onChange={(e) =>
                                setFormData({ ...formData, insurance_company: e.target.value })
                            }
                        />
                    </div>
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <label htmlFor="input_loan_amount" className="form-label fw-medium">
                                    จำนวนเงินต้น <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    id="input_loan_amount"
                                    name="loan_amount"
                                    className="form-control"
                                    value={formData.loan_amount}
                                    onChange={(e) =>
                                        setFormData({ ...formData, loan_amount: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <label
                                    htmlFor="input_interest_rate"
                                    className="form-label fw-medium"
                                >
                                    ดอกเบี้ย <span style={{ color: "red" }}> *</span>
                                </label>
                                <input
                                    type="number"
                                    id="input_interest_rate"
                                    name="interest_rate"
                                    className="form-control"
                                    value={formData.interest_rate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, interest_rate: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <label
                                    htmlFor="input_monthly_payment"
                                    className="form-label fw-medium"
                                >
                                    ค่างวดต่อเดือน <span style={{ color: "red" }}> *</span>
                                </label>
                                <input
                                    type="number"
                                    id="input_monthly_payment"
                                    name="monthly_payment"
                                    className="form-control"
                                    value={formData.monthly_payment}
                                    onChange={(e) =>
                                        setFormData({ ...formData, monthly_payment: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label htmlFor="input_start_date" className="form-label fw-medium">
                                    วันที่เริ่มต้น <span style={{ color: "red" }}> *</span>
                                </label>
                                <input
                                    type="date"
                                    id="input_start_date"
                                    name="start_date"
                                    className="form-control"
                                    value={formData.start_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, start_date: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label htmlFor="input_end_date" className="form-label fw-medium">
                                    วันที่สิ้นสุด <span style={{ color: "red" }}> *</span>
                                </label>
                                <input
                                    type="date"
                                    id="input_end_date"
                                    name="end_date"
                                    className="form-control"
                                    value={formData.end_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, end_date: e.target.value })
                                    }
                                />
                            </div>
                        </div>
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

export default Modal_AddAutoCar;
