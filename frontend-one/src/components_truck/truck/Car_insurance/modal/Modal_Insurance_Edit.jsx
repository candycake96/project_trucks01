import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_Insurance_Edit = ({ isOpen, onClose, onData, onSuccess }) => {
    if (!onData) return null;

    const [insuranceTypes, setInsuranceTypes] = useState([]);
    const [insuranceClass, setInsuranceClass] = useState([]);

    const [existingFile, setExistingFile] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    // ฟังก์ชันแปลงวันที่
    const formatDate = (dateString) => {
        const date = new Date(dateString); // สร้างอ็อบเจกต์ Date จากวันที่ที่ได้รับ
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('th-TH', options); // แสดงผลในรูปแบบวัน เดือน ปี (ภาษาไทย)
    };


    const [formData, setFormData] = useState({
        class_id: "",
        coverage_id: "",
        insurance_company: "",
        insurance_start_date: "",
        insurance_end_date: "",
        insurance_converage_amount: "",
        insurance_premium: "",
        insurance_file: null, // แก้ชื่อให้ตรงกับ backend
    });


    useEffect(() => {
        if (onData) {
            setFormData((prev) => ({
                ...prev,
                class_id: onData.class_id || "",
                coverage_id: onData.coverage_id || "",
                insurance_company: onData.insurance_company || "",
                insurance_start_date: onData.insurance_start_date?.split("T")[0] || "",
                insurance_end_date: onData.insurance_end_date?.split("T")[0] || "",
                insurance_converage_amount: onData.insurance_converage_amount || "",
                insurance_premium: onData.insurance_premium || "",
                insurance_file: null // 👈 เคลียร์ไฟล์ใหม่ เพราะยังไม่อัป
            }));
            setExistingFile(onData.insurance_file || ""); // 👈 เก็บชื่อไฟล์เก่า
        }
    }, [onData]);
    
    // จัดการ File Upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // จำกัดไฟล์ที่ขนาดไม่เกิน 2MB
                setErrorMessage("ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 2MB)");
                return;
            }
            if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
                setErrorMessage("ประเภทไฟล์ไม่ถูกต้อง (รองรับเฉพาะ .jpeg, .png, .pdf)");
                return;
            }
            setFormData((prev) => ({ ...prev, insurance_file: file }));
        }
    };

    const fetchInsuranceClass = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/car_insurance_coverage_type`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setInsuranceTypes(response.data);
        } catch (error) {
            console.error("Error fetching coverage type:", error);
        }
    };

    const fetchInsuranceTypes = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/car_insurance_class`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setInsuranceClass(response.data);
        } catch (error) {
            console.error("Error fetching insurance class:", error);
        }
    };

    useEffect(() => {
        fetchInsuranceClass();
        fetchInsuranceTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        
        console.log("📦 FormData Preview:");
        for (let pair of data.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }
        
        
        data.append("class_id", formData.class_id);
        data.append("coverage_id", formData.coverage_id);
        data.append("insurance_company", formData.insurance_company);
        data.append("insurance_start_date", formData.insurance_start_date);
        data.append("insurance_end_date", formData.insurance_end_date);
        data.append("insurance_converage_amount", formData.insurance_converage_amount);
        data.append("insurance_premium", formData.insurance_premium);

        if (formData.insurance_file) {
            data.append("insurance_file", formData.insurance_file);
        } 

        console.log("📤 Sending FormData:", Object.fromEntries(data.entries()));

        console.log('ดูข้อมูล :', JSON.stringify(data));
        console.log('ดูข้อมูล f :', JSON.stringify(formData));

        try {
            await axios.put(`${apiUrl}/api/car_insurance_update/${onData.insurance_id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "multipart/form-data"
                },
            });
            onClose();
            setMessage("Data saved successfully!");
            setMessageType("success");
            if (onSuccess) onSuccess(); // เรียกแบบ callback ธรรมดา
        } catch (error) {
            console.error("Error updating insurance:", error);
            setErrorMessage(error.response?.data?.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        }
    };


    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            // contentLabel="แก้ไขข้อมูล"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "950px",
                    maxHeight: "65vh",
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

            <div className="p-3">
                <div className="text-center mb-3">
                    <p className="fw-bolder">แก้ไขข้อมูลประกันภัย</p>
                </div>
                {message && (
                    <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}
                <div className="">
                <form onSubmit={handleSubmit} noValidate>
  <div className="row">
    <div className="col-lg-3">
      <label className="form-label fw-medium">วันที่เริ่มต้น</label>
      <input
        type="date"
        name="insurance_start_date"
        className="form-control"
        value={formData.insurance_start_date}
        onChange={handleChange}
      />
    </div>
    <div className="col-lg-3">
      <label className="form-label fw-medium">วันที่สิ้นสุด</label>
      <input
        type="date"
        name="insurance_end_date"
        className="form-control"
        value={formData.insurance_end_date}
        onChange={handleChange}
      />
    </div>
    <div className="col-lg-6">
      <label className="form-label fw-medium">บริษัทประกันภัย</label>
      <input
        type="text"
        name="insurance_company"
        className="form-control"
        value={formData.insurance_company}
        onChange={handleChange}
      />
    </div>

    <div className="row">
      <div className="col-lg-3">
        <label>จำนวนเงินคุ้มครอง</label>
        <input
          type="text"
          name="insurance_converage_amount"
          className="form-control"
          value={formData.insurance_converage_amount}
          onChange={handleChange}
        />
      </div>
      <div className="col-lg-3">
        <label className="form-label fw-medium">เบี้ยประกัน</label>
        <input
          type="text"
          name="insurance_premium"
          className="form-control"
          value={formData.insurance_premium}
          onChange={handleChange}
        />
      </div>
      <div className="col-lg-3">
        <label className="form-label fw-medium">ประเภทการคุ้มครอง <span style={{ color: "red" }}>*</span></label>
        <select
          className="form-select"
          name="coverage_id"
          value={formData.coverage_id}
          onChange={handleChange}
        >
          <option value="">เลือก</option>
          {insuranceTypes.map((row, index) => (
            <option key={index} value={row.id}>{row.coverage_type}</option>
          ))}
        </select>
      </div>
      <div className="col-lg-3">
        <label className="form-label fw-medium">ชั้นประกัน</label>
        <select
          className="form-select"
          name="class_id"
          value={formData.class_id}
          onChange={handleChange}
        >
          <option value="">เลือก</option>
          {insuranceClass.map((row, index) => (
            <option key={index} value={row.id}>{row.insurance_class}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="col">
      <label className="form-label fw-medium">เอกสารเพิ่มเติม</label>
      <input
        type="file"
        name="insurance_file"
        className="form-control"
        onChange={handleFileChange}
      />
      {existingFile && !formData.insurance_file && (
        <div className="mt-2">
          <small><a href={existingFile} className="" style={{color: "#cb4335 "}} >ไฟล์เดิม: <i class="bi bi-file-pdf-fill "></i> </a></small>
        </div>
      )}
    </div>
  </div>

  <div className="text-center mt-3">
    <button className="btn btn-primary" type="submit">บันทึก</button>
  </div>
</form>

                </div>
            </div>

        </ReactModal>
    )
}


export default Modal_Insurance_Edit;


