import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";

const Modal_Company_Edit = ({ isOpen, onClose, dataCompany }) => {
  if (!dataCompany) return null;

  const [isCompany, setCompany] = useState({
    company_name: "",
    company_address: "",
    company_logo: null, 
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (dataCompany) {
      setCompany({
        company_name: dataCompany.company_name || "",
        company_address: dataCompany.company_address || "",
        company_logo: dataCompany.company_logo || null,
      });
      setSelectedFile(null); // Reset file input
    }
  }, [dataCompany]);

  // Handle input text changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileChangeLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Form submission
  const handleSubmitCompanyEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("formData", JSON.stringify(isCompany));
  
      // Only append the logo file if it's selected
      if (selectedFile) {
        formData.append("company_logo", selectedFile);
      }

      console.log("FormData before submission:", Object.fromEntries(formData.entries()));
      
      const response = await axios.put(
        `${apiUrl}/api/editcompany/${dataCompany.company_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response && response.data) {
        setMessage(response.data.message);
        setMessageType("success");
      } else {
        setMessage("ไม่สามารถอัปเดตข้อมูลได้");
        setMessageType("danger");
      }
  
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 2000);
  
    } catch (error) {
      const errorMessage = error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล";
      setMessage(errorMessage);
      setMessageType("danger");
      console.error(error);
    }
  };
  
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="modal_company_edit"
      style={{
        content: {
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          margin: "auto",
          padding: "20px",
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
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-center">
          <p className="fw-bolder mx-auto">แก้ไขข้อมูลองค์กร</p>
          <button onClick={onClose} className="btn-close"></button>
        </div>

        {message && (
          <div className={`alert alert-${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmitCompanyEdit}>
          <div className="col-lg-12 mb-3">
            <label htmlFor="input_company_name" className="form-label fw-medium">
              ชื่อองค์กร
            </label>
            <input
              name="company_name"
              type="text"
              id="input_company_name"
              className="form-control"
              value={isCompany.company_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-lg-12 mb-3">
            <label htmlFor="input_company_address" className="form-label fw-medium">
              ที่อยู่ (ถ้ามี)
            </label>
            <textarea
              name="company_address"
              id="input_company_address"
              className="form-control"
              rows="4"
              value={isCompany.company_address}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-12 mb-3">
            <label htmlFor="input_company_logo" className="form-label fw-medium">
              รูปโลโก้บริษัท
            </label>
            <input
              name="company_logo"
              type="file"
              id="input_company_logo"
              className="form-control"
              onChange={handleFileChangeLogo}
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default Modal_Company_Edit;
