import React, { useState } from "react";
import ReactModal from "react-modal";
import { X } from "lucide-react";
import axios from "axios";
import { apiUrl } from "../../../../../config/apiConfig";

const Modal_show_vehicle_image = ({ isOpen, onClose, onData }) => {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" หรือ "error"

  const token = localStorage.getItem("token");

  // handle อัปโหลดหลายรูป
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];
    setImages(newImages);
    const urls = newImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // ลบรูปออกจาก preview
  const handleRemoveImage = (idx) => {
    const newImages = images.filter((_, i) => i !== idx);
    setImages(newImages);
    const urls = newImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // ส่งข้อมูลออกไป (โพสต์)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onData?.reg_id) {
      alert("ไม่พบรหัสรถ (reg_id)");
      return;
    }

    const formData = new FormData();
    images.forEach((img) => {
      formData.append("vehicle_img", img); // field ตรงกับ backend
    });
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("Access token is missing. Please log in.");
      setMessageType("error");
      return; // Stop form submission
    }
    try {
      const response = await axios.post(
        `${apiUrl}/api/img_vehicle_add/${onData.reg_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("อัปโหลดสำเร็จ!");
      setMessageType("success");

      setImages([]);
      setPreviewUrls([]);
      onClose();
    } catch (error) {
      console.error(
        "Upload Error:",
        error.response ? error.response.data : error.message
      );
      setMessage(
        error.response?.data?.message || "ไม่สามารถอัปโหลดรูปรถได้"
      );
      setMessageType("error");
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="โพสรูปรถ"
      style={{
        content: {
          width: "100%",
          maxWidth: "600px",
          maxHeight: "95vh",
          margin: "auto",
          padding: "0",
          border: "none",
          borderRadius: "0.75rem",
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
      <div className="modal-header bg-light border-bottom">
        <h5 className="modal-title fw-bold">
          เลือกรูปรถ {onData?.reg_id ? `#${onData.reg_id}` : ""}
        </h5>
        <button className="btn-close" onClick={onClose}></button>
      </div>

      {/* Body */}
      <div className="modal-body p-3" style={{ overflowY: "auto" }}>
        {/* ปุ่มอัปโหลด */}
        <div className="mb-3">
          <label className="btn btn-outline-primary w-100">
            📷 เลือกรูป
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Preview Gallery */}
        {previewUrls.length > 0 && (
          <div className="row g-2">
            {previewUrls.map((url, idx) => (
              <div className="col-6" key={idx}>
                <div className="position-relative">
                  <img
                    src={url}
                    alt={`preview-${idx}`}
                    className="img-fluid rounded shadow-sm"
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error / Success message */}
        {message && (
          <div
            className={`alert mt-3 ${messageType === "success" ? "alert-success" : "alert-danger"
              }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="modal-footer p-3">
        <button className="btn btn-secondary me-1" onClick={onClose}>
          ยกเลิก
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          บันทึก
        </button>
      </div>
    </ReactModal>
  );
};

export default Modal_show_vehicle_image;
