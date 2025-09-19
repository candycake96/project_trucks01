import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { apiUrl } from "../../../../config/apiConfig";
import axios from "axios";
import ReactModal from "react-modal";
import Modal_show_vehicle_image from "./Modal/Modal_show_vehicle_image";
import Modal_vehicle_book from "../expanded/modal/Modal_vehicle_book";
import Card_vehicle_data from "./card/Card_Vehicle_data";
import Insurance_table_truck_id from "../../Car_insurance/table/Insurance_table_truck_id";
import Table_vehicle_tax from "../table/Table_vehicle_tax";
import Table_vehicle_act from "./act/Table_vehicle_act";
import Card_vehicle_mainternance from "./card/Card_Vehicle_use";

ReactModal.setAppElement("#root");

const VehicleShowDataDetails = () => {
  const location = useLocation();
  const VehicleState = location.state || {};
  const [vehicleData, setVehicleData] = useState([]);
  const [listMenu, setListMenu] = useState("Vehicle_documents");
  const [isOpenModalImage, setOpenModalImage] = useState(false);
  const [isOpenModalBook, setOpenModalBook] = useState(false);
  const [isOpenModalBookData, setOpenModalBookData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // ref สำหรับ container ของรูป
  const imageContainerRef = useRef(null);

  // Fetch Vehicle Details
  const fetchRequestVehicle = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/vehicledetailgetid/${VehicleState?.reg_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setVehicleData(response.data);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  // Fetch Vehicle Images
  const fetchVehicleImages = async () => {
    if (!VehicleState?.reg_id) return;
    try {
      const response = await axios.get(
        `${apiUrl}/api/img_vehicle_show/${VehicleState.reg_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const images = response.data.images || [];
      setVehicleData((prev) => {
        if (prev.length > 0) {
          return [{ ...prev[0], images }];
        } else {
          return [{ images }];
        }
      });
    } catch (error) {
      console.error("Fetch Vehicle Images Error:", error);
    }
  };

  useEffect(() => {
    if (VehicleState?.reg_id) {
      fetchRequestVehicle();
      fetchVehicleImages();
    }
  }, [VehicleState?.reg_id]);

  // Modal Handlers
  const handleOpenModalImage = () => setOpenModalImage(true);
  const handleCloseModalImage = () => setOpenModalImage(false);
  const handleOpenModalBook = (data) => {
    setOpenModalBook(true);
    setOpenModalBookData(data);
  };
  const handleCloseModalBook = () => setOpenModalBook(false);

  // Gallery Handlers
  const openGallery = (index) => {
    setCurrentIndex(index);
    setIsGalleryOpen(true);
  };
  const closeGallery = () => setIsGalleryOpen(false);

  // Scroll container ของรูป
  const scrollLeft = () => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollBy({ left: -160, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollBy({ left: 160, behavior: "smooth" });
    }
  };

  // Render Content by Menu
  const renderContent = () => {
    switch (listMenu) {
      case "Vehicle_documents":
        return <Card_vehicle_data reg={VehicleState} />;
      case "Insurance":
        return <Insurance_table_truck_id dataTruck={VehicleState} />;
      case "Tax":
        return <Table_vehicle_tax dataVehicle={VehicleState} />;
      case "Act":
        return <Table_vehicle_act dataVehicle={VehicleState} />;
      case "Repair":
        return <Card_vehicle_mainternance reg={VehicleState} />;
      case "DriverUsage":
        return <div className="card p-3 shadow-sm">ข้อมูลการใช้รถ พขร.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 container">
      {/* Vehicle Header */}
      {vehicleData.map((row, index) => (
        <div key={index}>
          <div className="fw-bolder mb-3 fs-5">
            รถ {row.car_type_name} ทะเบียนรถ {row.reg_number}
          </div>
          <div className="d-flex align-items-center gap-2 mb-3">
            <button
              className="btn btn-outline-primary btn-sm rounded-pill px-3"
              onClick={() => handleOpenModalBook(row)}
            >
              ดูเล่มทะเบียน
            </button>
            <small className="text-muted fst-italic">อัพเดทล่าสุด: 12/09/2025</small>
          </div>
        </div>
      ))}

      {/* Vehicle Images Card */}
      <div className="card shadow-sm mb-4 position-relative">
        <div className="card-body position-relative">
          {/* ปุ่มเพิ่มรูปอยู่ตลอด */}
          <button
            className="btn btn-outline-primary btn-sm position-absolute"
            style={{ top: "10px", right: "10px", zIndex: 10 }}
            onClick={handleOpenModalImage}
          >
            <i className="bi bi-plus-lg me-1"></i>
            <i className="bi bi-image"></i>
          </button>

          {vehicleData.length > 0 && vehicleData[0].images?.length > 0 ? (
            <div className="position-relative">
              {/* ปุ่มเลื่อนซ้ายขวา */}
              <button
                className="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
                style={{ zIndex: 1 }}
                onClick={scrollLeft}
              >
                ‹
              </button>
              <button
                className="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
                style={{ zIndex: 1 }}
                onClick={scrollRight}
              >
                ›
              </button>

              {/* Row of images */}
              <div
                className="d-flex gap-2 overflow-auto"
                ref={imageContainerRef}
                style={{ padding: "10px 0" }}
              >
                {vehicleData[0].images.map((img, idx) => (
                  <div
                    key={img.img_id}
                    style={{
                      flex: "0 0 150px",
                      height: "150px",
                      overflow: "hidden",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => openGallery(idx)}
                  >
                    <img
                      src={img.img_url}
                      alt={`thumb-${idx}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <p>ยังไม่มีรูปภาพ</p>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Modal */}
<ReactModal
  isOpen={isGalleryOpen}
  onRequestClose={closeGallery}
  contentLabel="Image Gallery"
  style={{
    content: {
      border: "none",
      padding: 0,
      inset: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "transparent",
      overflow: "hidden",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.8)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  }}
>
  {vehicleData.length > 0 && vehicleData[0].images?.length > 0 && (
    <div
      className="position-relative"
      style={{
        width: "90vw",   // ไม่เกิน 90% ของ viewport width
        height: "90vh",  // ไม่เกิน 90% ของ viewport height
        maxWidth: "1200px",
        maxHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* รูปภาพ */}
      <img
        src={
          vehicleData[0].images[currentIndex].img_full_url ||
          vehicleData[0].images[currentIndex].img_url
        }
        alt={`gallery-${currentIndex}`}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain", // ป้องกัน crop หรือเบลอ
          borderRadius: "0.5rem",
        }}
      />

      {/* ปุ่มปิด */}
      <button
        className="btn btn-light position-absolute top-0 end-0 m-2"
        onClick={closeGallery}
        style={{ zIndex: 10 }}
      >
        ✕
      </button>

      {/* ปุ่มเลื่อนซ้าย */}
      <button
        className="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
        onClick={() =>
          setCurrentIndex((prev) =>
            prev === 0 ? vehicleData[0].images.length - 1 : prev - 1
          )
        }
        style={{ zIndex: 10, opacity: 0.7 }}
      >
        ‹
      </button>

      {/* ปุ่มเลื่อนขวา */}
      <button
        className="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
        onClick={() =>
          setCurrentIndex((prev) =>
            prev === vehicleData[0].images.length - 1 ? 0 : prev + 1
          )
        }
        style={{ zIndex: 10, opacity: 0.7 }}
      >
        ›
      </button>
    </div>
  )}
</ReactModal>





      {/* Action Cards Menu */}
      <div className="row g-3 mb-4">
        {[
          { key: "Vehicle_documents", icon: "bi-info-circle-fill", label: "เอกสารรถ (สมุดคู่มือ)" },
          { key: "Insurance", icon: "bi-speedometer2", label: "ประกันรถ" },
          { key: "Tax", icon: "bi-cash-stack", label: "ภาษีรถ" },
          { key: "Act", icon: "bi-shield-check", label: "พรบ.รถ" },
          { key: "Repair", icon: "bi-tools", label: "ข้อมูลซ่อมรถ" },
          { key: "DriverUsage", icon: "bi-person-lines-fill", label: "ข้อมูลการใช้รถ พขร." },
        ].map((item) => (
          <div className="col-md-3" key={item.key}>
            <div
              className={`card text-center shadow-sm border-0 ${listMenu === item.key ? "bg-primary text-white" : "bg-light"}`}
              onClick={() => setListMenu(item.key)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body">
                <i className={`bi ${item.icon} fs-3`}></i>
                <p className="mt-2 mb-0">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content by Selected Menu */}
      {renderContent()}

      {/* Add Image Modal */}
      {isOpenModalImage && (
        <Modal_show_vehicle_image isOpen={isOpenModalImage} onClose={handleCloseModalImage} onData={VehicleState} />
      )}

      {/* Vehicle Book Modal */}
      {isOpenModalBook && (
        <Modal_vehicle_book isOpen={isOpenModalBook} onClose={handleCloseModalBook} dataTruck={isOpenModalBookData} />
      )}
    </div>
  );
};

export default VehicleShowDataDetails;
