import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_edit_vehicle_other = ({ isOpen, onClose, dataVehicle}) => {
  const [formData, setFormdata] = useState({
    car_type_id: "",
    id_branch: "",
    file_download: null,
  });
  const [error, setError] = useState(null);
  const [isCarType, setCarType] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
        useEffect(() => {
            // ดึงข้อมูลผู้ใช้จาก localStorage
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData)); // แปลง JSON เป็น Object แล้วเก็บใน state
            }
        }, [])

  useEffect(() => {
    if (dataVehicle) {
      setFormdata({
        car_type_id: dataVehicle.car_type_id || "",
        id_branch: dataVehicle.id_branch || "",
        file_download: null,
      });
    }
  }, [dataVehicle]);

  const fetchCarType = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${apiUrl}/api/detailscartype`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCarType(response.data);
    } catch (error) {
      console.error("Error fetching car types:", error);
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (user && user.company_id) {
        const response = await axios.get(`${apiUrl}/api/getbranches/${user.company_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBranches(response.data);
      } else {
        console.error("User or company_id is missing");
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  }, [user]);
  
  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      Promise.all([fetchCarType(), fetchBranches()])
        .then(() => setLoading(false))
        .catch((error) => {
          console.error("Error in fetching data:", error);
          setLoading(false); // Ensure loading state is reset even on error
        });
    }
  }, [isOpen, fetchCarType, fetchBranches, user]);
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormdata({ ...formData, file_download: file });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const formDataObj = new FormData();
      
      // Append car type and branch, defaulting to existing values if not changed
      const carType = formData.car_type_id || dataVehicle.car_type_id;
      const branch = formData.id_branch || dataVehicle.id_branch;
  
      // Log the data to ensure it's correct
      console.log("Car Type:", carType);
      console.log("Branch:", branch);
      
      formDataObj.append("car_type_id", carType);
      formDataObj.append("id_branch", branch);
  
      // Handle the file upload (or set to null if no file selected)
      const file = formData.file_download || null;
      console.log("File:", file);
      
      formDataObj.append("file_download", file);
  
      // Check FormData content before sending
      for (let pair of formDataObj.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
  
      // Send the form data
      const response = await axios.put(
        `${apiUrl}/api/vehicle_updata_other_doc/${dataVehicle.reg_id}`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("✅ Response:", response.data);
      // onSave(response.data);
      onClose();
    }  catch (error) {
      console.error("❌ Error saving data:", error);
      if (error.response) {
          console.error("📌 Backend Error Response:", error.response.data);
      }
      setError("An error occurred while saving data. Please try again.");
  }
  
  };
  
  return (
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
      <div className="p-3">
        <div className="text-center mb-3">
          <p className="fw-bolder">แก้ไขข้อมูล </p>
        </div>
  
        {loading ? (
          <p className="text-center">กำลังโหลดข้อมูล...</p>
        ) : (
          <div className="row mb-3">
            <div className="col-lg-6">
              <label htmlFor="input_car_type_id" className="form-label fw-medium">
                ประเภทรถ
              </label>
              <select
                className="form-select"
                id="input_car_type_id"
                name="car_type_id"
                value={formData.car_type_id}
                onChange={(e) => setFormdata({ ...formData, car_type_id: e.target.value })}
              >
                <option value="">เลือกประเภทรถ</option>
                {isCarType.length > 0 ? (
                  isCarType.map((rowCarType) => (
                    <option key={rowCarType.car_type_id} value={rowCarType.car_type_id}>
                      {rowCarType.car_type_name}
                    </option>
                  ))
                ) : (
                  <option disabled>ไม่มีข้อมูล</option>
                )}
              </select>
            </div>
            <div className="col-lg-6">
              <label htmlFor="input_id_branch" className="form-label fw-medium">
                สาขา
              </label>
              <select
                className="form-select"
                id="input_id_branch"
                name="id_branch"
                value={formData.id_branch}
                onChange={(e) => setFormdata({ ...formData, id_branch: e.target.value })}
              >
                <option value="">เลือกสาขา</option>
                {branches.length > 0 ? (
                  branches.map((rowBranches) => (
                    <option key={rowBranches.id_branch} value={rowBranches.id_branch}>
                      {rowBranches.branch_name}
                    </option>
                  ))
                ) : (
                  <option disabled>ไม่มีข้อมูล</option>
                )}
              </select>
            </div>
            <div className="col-lg-6 mb-3">
              <label htmlFor="input_file_download" className="form-label fw-medium">
                ไฟล์สแกนเอกสารรถ (ถ้ามี)
              </label>
              <input
                type="file"
                id="input_file_download"
                className="form-control"
                name="file_download"
                onChange={handleFileChange}
              />
            </div>
            <div className="text-center">
              <button className="btn Teal-button" onClick={handleSave} disabled={loading}>
                บันทึก
              </button>
            </div>
          </div>
        )}
        {error && <p className="text-danger">{error}</p>}
      </div>
    </ReactModal>
  );
  
};

export default Modal_edit_vehicle_other;
