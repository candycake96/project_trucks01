import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";

Modal.setAppElement("#root");

const Driver_relation_management = ({ isOpen, onClose, dataVehicle, onSuccess }) => {
  const [user, setUser] = useState(null);
  const [dataRelation, setDataRelation] = useState({
    reg_id: "",
    code: "",
    assigned_date: "",
    notes: "",
    assigned_by: "",
    id_emp: "",  // Ensure that id_emp is included
  });

  const [userDriver, setUserDriver] = useState([]);
  const [filteredUserDriver, setFilteredUserDriver] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setDataRelation((prevState) => ({
        ...prevState,
        assigned_by: `${parsedUser.fname} ${parsedUser.lname}`,
      }));
    }
  }, []);

  useEffect(() => {
    if (dataVehicle?.reg_id) {
      setDataRelation((prevState) => ({
        ...prevState,
        reg_id: dataVehicle.reg_id,
      }));
    }
  }, [dataVehicle]);

  useEffect(() => {
    setDataRelation((prevState) => ({
      ...prevState,
      assigned_date: new Date().toISOString().split("T")[0],
    }));
  }, []);

  const fetchUserDriver = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/getdriver`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUserDriver(response.data);
      setFilteredUserDriver(response.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  useEffect(() => {
    fetchUserDriver();
  }, []);

  const [searchTerm, setSearchTerm] = useState(""); // เพิ่ม useState สำหรับ searchTerm

  const handleSearchInput = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    // กรองรายชื่อคนขับที่ตรงกับรหัสพนักงาน
    const filteredUsers = userDriver.filter((user) =>
      user.code.toLowerCase().includes(searchValue.toLowerCase())
    );

    // ถ้าเจอ 1 คน หรือไม่เจอให้อัปเดตค่าใน dataRelation
    if (filteredUsers.length === 1) {
      setDataRelation((prev) => ({
        ...prev,
        id_emp: filteredUsers[0].id_emp,
        code: filteredUsers[0].code,
      }));
    } else {
      setDataRelation((prev) => ({
        ...prev,
        id_emp: "",
        code: searchValue,  // คงค่าของ code ถ้าไม่มีผลลัพธ์
      }));
    }

    // อัปเดต filteredUserDriver ให้แสดงผลตาม search
    setFilteredUserDriver(filteredUsers);
  };

  const handleSelectChange = (e) => {
    const selectedIdEmp = e.target.value;

    const foundUser = userDriver.find((user) => user.id_emp === Number(selectedIdEmp));

    if (foundUser) {
      setDataRelation((prev) => ({
        ...prev,
        id_emp: foundUser.id_emp,
        code: foundUser.code,
      }));
    } else {
      setDataRelation((prev) => ({
        ...prev,
        id_emp: "",
        code: "", // ล้างค่าของ code ถ้าไม่มีการเลือกที่ตรง
      }));
    }
  };




  const handleSubmitAddEmpRelation = async (e) => {
    e.preventDefault();
    console.log("📌 Data before sending:", dataRelation);

    // Validate required fields
    if (!dataRelation.code || !dataRelation.reg_id || !dataRelation.id_emp) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/add_driver_relation`,
        dataRelation,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("✅ Response:", response.data);
      alert("บันทึกข้อมูลสำเร็จ!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Error saving data:", error);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="Employee Details"
      style={{
        content: {
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
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
      <div className="p-3 mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <p className="fw-bolder mx-auto">การจัดการมอบหมายคนขับรถ (พขร.)</p>
          <button onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="col-lg-12 mb-3">
          <label htmlFor="input_reg_number" className="form-label fw-medium">
            ทะเบียนรถ
          </label>
          <input
            type="text"
            name="reg_number"
            id="input_reg_number"
            className="form-control"
            value={dataVehicle.reg_number}
            readOnly
          />
        </div>

        <div className="col-lg-12 mb-3">
          <label htmlFor="input_code" className="form-label fw-medium">
            รหัสพนักงาน<span style={{ color: "red" }}> *</span>
          </label>
          <div className="input-group">
            <input
              type="text"
              name="code"
              id="input_code"
              className="col-3"
              value={dataRelation.code}  // Ensure it reflects the updated code
              onChange={handleSearchInput}  // Update the code when typing
              placeholder="xxxxx"
            />

            <select
              id="userroleSelect"
              className="form-select "
              value={dataRelation.id_emp || ""}
              onChange={handleSelectChange}  // Handle change when selecting a user
            >
              {(dataRelation.code === "" || dataRelation.code === "0") && <option value="">เลือกพนักงาน</option>}
              {filteredUserDriver.map((user) => (
                <option key={user.id_emp} value={user.id_emp}>
                  {user.fname} {user.lname} ({user.id_emp})
                </option>
              ))}
            </select>

          </div>
        </div>

        <div className="col-lg-12 mb-3">
          <label htmlFor="input_assigned_date" className="form-label fw-medium">
            วันที่มอบหมาย
          </label>
          <input
            type="date"
            name="assigned_date"
            id="input_assigned_date"
            className="form-control"
            value={dataRelation.assigned_date}
            onChange={(e) => setDataRelation({ ...dataRelation, assigned_date: e.target.value })}
          />
        </div>

        <div className="col-lg-12 mb-3">
          <label htmlFor="input_note" className="form-label fw-medium">
            หมายเหตุเพิ่มเติม (ถ้ามี)
          </label>
          <textarea
            name="note"
            id="input_note"
            className="form-control"
            rows="4"
            value={dataRelation.notes}
            onChange={(e) => setDataRelation({ ...dataRelation, notes: e.target.value })}
          />
        </div>

        <div className="text-center">
          <button className="btn" style={{ background: "Teal", color: "#ffffff" }} onClick={handleSubmitAddEmpRelation}>
            บันทึก
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Driver_relation_management;
