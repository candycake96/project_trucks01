import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { apiUrl } from "../../../config/apiConfig";

const EditDriverLicense = ({ isOpen, onClose, rowDriver, emp }) => {
  const [drivingLicenseTypes, setDrivingLicenseTypes] = useState([]);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 


  const fetchDrivingLicenseTypes = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/getdrivinglicensetypes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setDrivingLicenseTypes(response.data);
    } catch (error) {
      console.error("Error fetching license types:", error);
    }
  };

  useEffect(() => {
    fetchDrivingLicenseTypes();
    if (rowDriver) {
      setFormData(rowDriver);
    };
    if (rowDriver) {
      setFormData({
        ...rowDriver,
        issued_date: rowDriver.issued_date ? rowDriver.issued_date.split("T")[0] : "",
        expiry_date: rowDriver.expiry_date ? rowDriver.expiry_date.split("T")[0] : "",
      });
    };

  }, [rowDriver]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiUrl}/api/updatedriverlicense/${formData.id_driver}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
      console.log(response.data);
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error updating driver license:", error);
      setMessage(
        error.response?.data?.message || "An unexpected error occurred"
      );
      setMessageType("error");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Driver License"
      style={{
        content: {
          width: "90%",
          maxWidth: "800px",
          height: "80%",
          margin: "auto",
          padding: "0",
          border: "none",
          borderRadius: "0.5rem",
          overflowY: "auto",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
        },
      }}
    >
      <div className="p-3 text-center">
        <h2>อัพเดตข้อมูลใบอนุญาติการขับขี่ของพนักงาน </h2>
      </div>
      {message && (
        <div
          className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"
            }`}
        >
          {message}
        </div>
      )}
      {formData ? (
        <form onSubmit={handleSubmit} className="p-3">
          <div className="row ">
            <div className="col-lg-6 mb-3">
              <label htmlFor="license_number" className="form-label">
                รหัสใบขับขี่
              </label>
              <input
                type="text"
                className="form-control"
                id="license_number"
                name="license_number"
                value={formData.license_number || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-lg-6 mb-3">
              <label htmlFor="name" className="form-label">
                ชื่อ
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={`${emp.fname || ""} ${emp.lname || ""}`}
                disabled
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 mb-3">
              <label htmlFor="issued_date" className="form-label">
                วันที่ออกใบขับขี่
              </label>
              <input
                type="date"
                className="form-control"
                id="issued_date"
                name="issued_date"
                value={formData.issued_date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-lg-4 mb-3">
              <label htmlFor="expiry_date" className="form-label">
                วันที่หมดอายุใบขับขี่
              </label>
              <input
                type="date"
                className="form-control"
                id="expiry_date"
                name="expiry_date"
                value={formData.expiry_date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-lg-4 mb-3">
              <label htmlFor="license_type_id" className="form-label">
                ประเภทใบขับขี่
              </label>
              <select
                className="form-select"
                id="license_type_id"
                name="license_type_id"
                value={formData.license_type_id || ""}
                onChange={handleInputChange}
              >
                <option value="">กรุณาเลือกประเภทใบขับขี่ <span style={{ color: "red" }}> *</span></option>
                {drivingLicenseTypes.map((LType) => (
                  <option key={LType.license_type_id} value={LType.license_type_id}>
                    {LType.license_code} {LType.license_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="issuing_authority" className="form-label">
              หน่วยงานที่ออกใบขับขี่
            </label>
            <input
              type="text"
              className="form-control"
              id="issuing_authority"
              name="issuing_authority"
              value={formData.issuing_authority || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="text-center">
            <button
              className="btn"
              type="submit"
              style={{ background: "#20c997", color: "#fff" }}
            >
              บันทึก
            </button>
            <button className="btn " type="button" onClick={onClose} style={{ background: "#e74c3c" }}>ยกเลิก</button>
          </div>
        </form>
      ) : (
        <p>ไม่มีข้อมูลผู้ขับรถที่เลือก</p>
      )}

    </Modal>
  );
};

export default EditDriverLicense;
