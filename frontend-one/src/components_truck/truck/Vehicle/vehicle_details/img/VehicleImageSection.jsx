import React, { useState } from "react";
import ReactModal from "react-modal";
import './VehicleImageSection.css'

ReactModal.setAppElement("#root"); // ป้องกัน warning accessibility

const VehicleImageSection = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openModal = (index) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-muted fst-italic small">
        <i className="bi bi-image"></i> ไม่มีรูปภาพ
      </div>
    );
  }

  return (
    <div>
      {/* รูปแรก */}
      <img
        src={images[0]}
        alt="vehicle"
        className="img-fluid rounded shadow-sm mb-2"
        style={{ cursor: "pointer", maxHeight: "250px", objectFit: "cover" }}
        onClick={() => openModal(0)}
      />

      {/* Thumbnail preview ถ้ามีหลายรูป */}
      {images.length > 1 && (
        <div
          className="d-flex gap-2 overflow-auto"
          style={{ maxWidth: "100%", whiteSpace: "nowrap" }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`thumb-${index}`}
              className="img-thumbnail"
              style={{
                width: "80px",
                height: "60px",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => openModal(index)}
            />
          ))}
        </div>
      )}

      {/* Modal แสดงภาพ */}
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button className="btn btn-sm btn-light" onClick={prevImage}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <span className="text-muted small">
            {activeIndex + 1}/{images.length}
          </span>
          <button className="btn btn-sm btn-light" onClick={nextImage}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        <img
          src={images[activeIndex]}
          alt={`vehicle-${activeIndex}`}
          className="img-fluid d-block mx-auto rounded shadow"
          style={{ maxHeight: "80vh", objectFit: "contain" }}
        />

        <div className="text-center mt-3">
          <button className="btn btn-outline-danger btn-sm" onClick={closeModal}>
            ปิด
          </button>
        </div>
      </ReactModal>
    </div>
  );
};

export default VehicleImageSection;
