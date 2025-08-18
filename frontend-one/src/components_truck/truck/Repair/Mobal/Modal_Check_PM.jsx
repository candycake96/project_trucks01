import React from "react";
import ReactModal from "react-modal";

const Modal_Check_PM = ({ isOpen, onClose }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="ตรวจสอบ PM"
      style={{
        content: {
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "90vh",
          margin: "auto",
          padding: "0",
          border: "none",
          borderRadius: "0.5rem",
          overflow: "hidden",
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
        className="modal-header bg-light border-bottom"
        style={{
          padding: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 2,
        }}
      >
        <h5 className="modal-title fw-bold m-0">🔍 ตรวจสอบ PM รถยนต์</h5>
        <button
          onClick={onClose}
          className="btn-close"
          style={{ marginLeft: "auto" }}
        ></button>
      </div>

      {/* Body */}
      <div className="modal-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <div className="mb-3">
          <label className="form-label fw-bold">เลขทะเบียนรถ:</label>
          <div className="form-control-plaintext">XX-1234</div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">วันที่ PM ล่าสุด:</label>
          <div className="form-control-plaintext">01/07/2025</div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">สถานะ PM:</label>
          <span className="badge bg-success ms-2">ผ่านการตรวจสอบ</span>
        </div>

        {/* 🛠️ เพิ่มข้อมูลตรวจเช็คอื่น ๆ ได้ที่นี่ */}
      </div>

      {/* Footer */}
      <div className="modal-footer bg-light border-top d-flex justify-content-end p-3">
        <button className="btn btn-secondary me-2" onClick={onClose}>
          ปิดหน้าต่าง
        </button>
        <button className="btn btn-primary">
          บันทึกการตรวจสอบ
        </button>
      </div>
    </ReactModal>
  )
}


export default Modal_Check_PM;