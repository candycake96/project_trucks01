import React from "react";
import ReactModal from "react-modal";

const Modal_invoice_mismatch = ({ isOpen, onClose }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="แก้ไขการอนุมัติ"
            style={{
                content: {
                    width: "100%",
                    height: "400px",
                    maxWidth: "600px",
                    margin: "auto",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9999,
                },
            }}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 relative rounded-t-lg">
                <h2 className="text-lg font-semibold">ข้อมูลไม่ตรง / แจ้งแก้ไข</h2>
                <p className="text-blue-200 text-sm mt-1">ส่งข้อมูลแจ้งผู้เกี่ยวข้องเพื่อแก้ไขข้อมูลให้ถูกต้อง (ฝ่ายวิเคราะห์แผนซ่อมบำรุง)</p>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white hover:text-gray-200 text-sm"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <div className="">
                <div className="mb-3">
                    <label className="form-label">หมายเหตุ</label>
                    <textarea
                        className="form-control"
                    // rows={3}
                    // value={dataApproval.remark}
                    // onChange={(e) => handleChange("remark", e.target.value)}
                    />
                </div>

                {/* <div className="mb-3">
                    <label className="form-label">รูปภาพ</label>
                    <input
                        className="form-control"
                        type="file"
                    // rows={3}
                    // value={dataApproval.remark}
                    // onChange={(e) => handleChange("remark", e.target.value)}
                    />
                </div> */}

                <div className="">
                    <button className="btn btn-primary btn-sm">ส่งข้อมูล</button>
                </div>

            </div>

        </ReactModal>
    )
}

export default Modal_invoice_mismatch; 