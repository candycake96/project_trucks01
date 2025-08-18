import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { Button } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";

const Modal_signature_emp = ({ isOpen, onClose, onData }) => {
    const [signatureUrl, setSignatureUrl] = useState(null);

    // ฟังก์ชันโหลดลายเซ็นจาก backend
    const fetchSignature = async () => {
        if (!onData?.id_emp) return;
        try {
            const response = await axios.get(`${apiUrl}/api/signatuer_show/${onData?.id_emp}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (Array.isArray(response.data) && response.data.length > 0) {
                setSignatureUrl(response.data[0].signature); // ดึง URL ออกมาโดยตรง
            } else {
                setSignatureUrl(null);
            }
        } catch (error) {
            console.error("Error fetching signature:", error);
            setSignatureUrl(null);
        }
    };


    // โหลดลายเซ็นเมื่อเปิด modal หรือเมื่อ onData เปลี่ยน
    useEffect(() => {
        if (onData?.id_emp) {
            fetchSignature();
        }
    }, [onData]);

    // ฟังก์ชันอัปโหลดลายเซ็นใหม่
    const handleUpload = async () => {
        const file = document.querySelector('input[name="signature"]').files[0];
        if (!file || !onData?.id_emp) return;

        const formData = new FormData();
        formData.append("signature", file);

        try {
            await axios.post(`${apiUrl}/api/signatuer_add/${onData?.id_emp}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            alert("อัปโหลดลายเซ็นสำเร็จ");
            fetchSignature();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("อัปโหลดลายเซ็นล้มเหลว");
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="ลายมือชื่อผู้ใช้"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "600px",
                    maxHeight: "80vh",       // สูงสุดไม่เกิน 80% ของ viewport height
                    margin: "auto",
                    padding: "30px",
                    borderRadius: "16px",
                    overflowY: "auto",       // แสดง scrollbar เมื่อเนื้อหาเกิน
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                },
            }}

        >
            <div className="text-center mb-4">
                <h5 className="fw-bold">ลายมือชื่อผู้ใช้งาน {onData?.id_emp}</h5>
                <p className="text-muted">จัดการลายเซ็นของคุณที่นี่ ขนาดไฟล์แนะนำ 1280 x 720</p>
            </div>

            {/* แสดงลายเซ็นถ้ามี */}
            {signatureUrl ? (
                <div
  style={{
    position: "relative",
    width: "100%",
    height: "300px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#fff",
    // ใช้ background ซ้ำลายน้ำข้อความ
    backgroundImage: `
      repeating-linear-gradient(
        -45deg,
        rgba(0, 0, 0, 0.03) 0,
        rgba(0, 0, 0, 0.03) 1px,
        transparent 1px,
        transparent 20px
      ),
      repeating-linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.03) 0,
        rgba(0, 0, 0, 0.03) 1px,
        transparent 1px,
        transparent 20px
      )
    `,
    backgroundSize: '40px 40px'
  }}
>
  {/* ลายน้ำข้อความซ้ำแบบเบลอโปร่งแสง */}
  <div
    style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignContent: "center",
      gap: "40px",
      pointerEvents: "none",
      userSelect: "none",
      zIndex: 0,
    }}
  >
    {Array.from({ length: 30 }).map((_, i) => (
      <span
        key={i}
        style={{
          transform: "rotate(-30deg)",
          fontSize: "36px",
          color: "rgba(0, 0, 0, 0.05)",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          width: "150px",
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        ลายเซ็นของบริษัท
      </span>
    ))}
  </div>

  {/* รูปลายเซ็น อยู่ด้านหน้า */}
  <img
    src={signatureUrl}
    alt="Signature"
    style={{
  position: "relative",
        display: "block",
        margin: "0 auto",
        maxWidth: "100%",
        height: "auto",
        zIndex: 1,
        pointerEvents: "none",
        userSelect: "none",
        borderRadius: "8px",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    }}
    onContextMenu={(e) => e.preventDefault()}
  />
</div>


            ) : (
                <p className="text-center text-muted">ยังไม่มีลายเซ็น</p>
            )}


            {/* เลือกไฟล์ */}
            <div className="mb-3 p-3">
                <input
                    type="file"
                    name="signature"
                    accept="image/*"
                    className="form-control"
                />
            </div>

            {/* ปุ่มอัปโหลด */}
            <div className="d-flex justify-content-center gap-3">
                <Button
                    className="btn"
                    variant="success"
                    onClick={handleUpload}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                    <FaPlus /> เพิ่ม / อัปโหลด
                </Button>

            </div>

            {/* ปุ่มปิด */}
            {/* <div className="text-end mt-4">
                <Button variant="secondary" onClick={onClose}>
                    ปิด
                </Button>
            </div> */}

        </ReactModal>
    );
};

export default Modal_signature_emp;
