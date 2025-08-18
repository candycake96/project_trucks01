import React from "react";
import ReactModal from "react-modal";

const Modal_CarMileageForm = ({ isOpen, onClose }) => {
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
                }}>

                <div className="p-3">
                    <div className="text-center fw-bolder mb-3">
                        บันทึกเลขไมล์รถ
                    </div>
                    <form action="">
                        <div className="mb-3">
                            <label htmlFor="input_reg_date" className="form-label fw-medium">เลขไมล์รถ  <span style={{ color: "red" }}> *</span></label>
                            <input
                                type="text"
                                id="input_reg_date"
                                name="reg_date"
                                className="form-control"
                            // value={formData.reg_date}
                            // onChange={(e) => setFormdata({ ...formData, reg_date: e.target.value })}
                            />
                        </div>
                        <div className="text-center mb-3">
                            <button className="btn Teal-button">
                                บันทึก
                            </button>
                        </div>
                    </form>
                </div>
            </ReactModal>

        </>
    )
}

export default Modal_CarMileageForm;