import React from "react";
import ReactModal from "react-modal";

const Modal_RepairRequestForm = ({isOpen, onClose}) => {
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
<div className="p-2">
    <div className="text-center">
        <p className="fw-bolder">ฟอร์มแจ้งซ่อม</p>
    </div>
</div>
        </ReactModal>
        
        </>
    )
}

export default Modal_RepairRequestForm;