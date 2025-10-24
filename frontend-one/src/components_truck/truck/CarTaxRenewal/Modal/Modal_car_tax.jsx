// Modal_car_tax.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_car_tax = ({ isOpen, onClose }) => {
  const [isDataTaxend, setDataTaxend] = useState([]);
  const [searchRegNumber, setSearchRegNumber] = useState("");
  const [searchCarType, setSearchCarType] = useState("");
  const [showAll, setShowAll] = useState(false);

  const fetchTaxend = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/tax_managment_show`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setDataTaxend(response.data || []);
    } catch (error) {
      console.error("Error fetching Taxend:", error);
    }
  };

  const fetchTaxendAll = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/tax_managment_show_all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setDataTaxend(response.data || []);
    } catch (error) {
      console.error("Error fetching Taxend all:", error);
    }
  };

  // เมื่อ modal เปิด ให้โหลดข้อมูลใหม่; เมื่อปิด รีเซ็ต state เล็กน้อย
  useEffect(() => {
    if (isOpen) {
      fetchTaxend();
    } else {
      // reset ถ้าต้องการ (ไม่จำเป็นเสมอไป) — ช่วยให้เปิดใหม่เป็นสถานะเริ่มต้น
      setShowAll(false);
      setSearchRegNumber("");
      setSearchCarType("");
      setDataTaxend([]);
    }
  }, [isOpen]);

  const toggleDataView = () => {
    if (!showAll) {
      fetchTaxendAll();
      setShowAll(true);
    } else {
      fetchTaxend();
      setShowAll(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
  };

  // filter แบบไม่เข้มงวด (trim + toLowerCase)
  const filteredData = (isDataTaxend || []).filter((rowTax) => {
    const reg = (rowTax?.reg_number || "").toString().toLowerCase();
    const carType = (rowTax?.car_type_name || "").toString().toLowerCase();
    return reg.includes(searchRegNumber.trim().toLowerCase()) && carType.includes(searchCarType.trim().toLowerCase());
  });

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="Vehicle Tax Info"
      shouldCloseOnOverlayClick={true}
      style={{
        content: {
          width: "95%",
          maxWidth: "980px",
          maxHeight: "85vh",
          margin: "auto",
          padding: 0,
          border: "none",
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      {/* Header (เต็มความกว้าง) */}
      <div
        className="d-flex align-items-center justify-content-between px-4"
        style={{
          background: "#0d6efd",
          color: "#fff",
          height: 64,
          flex: "0 0 64px",
        }}
      >
        <div className="d-flex align-items-center">
          <i className="bi bi-truck fs-4 me-2" aria-hidden />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>ข้อมูลรถ - ภาษี</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>สรุปสถานะภาษีของยานพาหนะ</div>
          </div>
        </div>

        <div>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={onClose}
            aria-label="Close modal"
            title="ปิด"
          >
            ปิด
          </button>
        </div>
      </div>

      {/* Body (เลื่อนภายใน modal) */}
      <div
        className="p-3"
        style={{
          overflowY: "auto",
          flex: "1 1 auto",
          background: "#fff",
        }}
      >
        {/* Search controls */}
        <div className="row gy-3 align-items-end mb-3">
          <div className="col-md-4">
            <label className="form-label mb-1 fw-semibold">ค้นหาทะเบียน</label>
            <input
              type="text"
              className="form-control"
              placeholder="เช่น กก1234"
              value={searchRegNumber}
              onChange={(e) => setSearchRegNumber(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label mb-1 fw-semibold">ค้นหาประเภทรถ</label>
            <input
              type="text"
              className="form-control"
              placeholder="เช่น รถบรรทุก, หัวลาก"
              value={searchCarType}
              onChange={(e) => setSearchCarType(e.target.value)}
            />
          </div>

          <div className="col-md-4 text-md-end">
            <button
              className={`btn ${showAll ? "btn-outline-secondary" : "btn-primary"} w-100`}
              onClick={toggleDataView}
            >
              {showAll ? "ย้อนกลับ" : "แสดงทั้งหมด"}
            </button>
          </div>
        </div>

        {/* Table wrapper: ให้เลื่อนได้ (แนวตั้ง) และเอียงซ้าย-ขวา scroll ได้ถ้ากว้าง */}
        <div style={{ maxHeight: "55vh", overflowY: "auto" }} className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 60 }} className="text-center">ลำดับ</th>
                <th>ทะเบียน</th>
                <th>ประเภทรถ</th>
                <th style={{ minWidth: 140 }}>วันที่หมดอายุ</th>
                <th style={{ width: 140 }} className="text-center">สถานะ</th>
                <th style={{ width: 90 }} className="text-center">#</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((rowTax, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="fw-semibold">{rowTax?.reg_number || "-"}</td>
                    <td>{rowTax?.car_type_name || "-"}</td>
                    <td>{formatDate(rowTax?.tax_date_end)}</td>
                    <td className="text-center">
                      {rowTax?.tax_status === "หมดอายุ" ? (
                        <span className="badge bg-danger">{rowTax?.tax_status}</span>
                      ) : rowTax?.tax_status === "ใกล้หมดอายุ" ? (
                        <span className="badge bg-warning text-dark">{rowTax?.tax_status}</span>
                      ) : rowTax?.tax_status === "ยังไม่มีข้อมูล" ? (
                        <span className="badge bg-secondary">{rowTax?.tax_status}</span>
                      ) : (
                        <span className="badge bg-success">{rowTax?.tax_status}</span>
                      )}
                    </td>
                    <td className="text-center">
                      <Link to="/truck/VehicleShowDataDetails" state={rowTax} className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-pencil-fill"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    <i className="bi bi-exclamation-circle me-2"></i> ไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* optional: footer actions */}
        {/* <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            ปิด
          </button>
        </div> */}
      </div>

      {/* small CSS for sticky header inside the table (applies to thead) */}
      <style>{`
        /* ทำให้ thead ติดอยู่ด้านบนเมื่อ scroll ภายใน table-wrapper */
        .table-responsive thead th {
          position: sticky;
          top: 0;
          z-index: 5;
          background: #f8f9fa;
        }
      `}</style>
    </ReactModal>
  );
};

export default Modal_car_tax;
