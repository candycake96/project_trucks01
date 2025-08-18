import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";
import EditPermission from "./EditPermission";


const EditRol = ({ isOpen, onClose, emp }) => {
  if (!emp) return null;

  const [empRoles, setEmpRoles] = useState([]); // สิทธิ์ที่พนักงานมี
  const [availableRoles, setAvailableRoles] = useState([]); // สิทธิ์ทั้งหมดที่มีในระบบ
  const [selectedRoles, setSelectedRoles] = useState([]); // สิทธิ์ที่ผู้ใช้เลือก
  const id = emp.id_emp;
  


  // Fetch all available roles
  const fetchAvailableRoles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/getroles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Available Roles:", response.data); // ตรวจสอบข้อมูล roles ทั้งหมด
      setAvailableRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Fetch employee roles
  const fetchEmpRoles = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/getemployeeroles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const empRoleIds = response.data.map((role) => role.role_id);
      console.log("Employee Roles:", empRoleIds); // ตรวจสอบ role_id ที่ได้จาก employee
      setSelectedRoles(empRoleIds);
    } catch (error) {
      console.error("Error fetching employee roles:", error);
    }
  };

  // Load data when `emp` changes
  useEffect(() => {
    if (emp) {
      fetchAvailableRoles();
      fetchEmpRoles();
    }
  }, [emp]);

  // Handle role toggle (select or deselect)
  const handleRoleToggle = (role) => {
    setSelectedRoles((prevRoles) =>
      prevRoles.includes(role.role_id)
        ? prevRoles.filter((id) => id !== role.role_id) // Remove role
        : [...prevRoles, role.role_id] // Add role
    );
  };

  // Save the selected roles
  const saveRoles = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/updateemployeeroles/${id}`,
        { selectedRoles },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      alert("Roles updated successfully.");
      onClose(); // Close Modal after saving
    } catch (error) {
      console.error("Error updating roles:", error);
      alert("Failed to update roles.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Employee Roles"
      style={{
        content: {
          width: "90%",
          maxWidth: "800px",
          height: "80%",
          margin: "auto",
          padding: "2rem",
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
      <div>
        <div className="mb-2">
          <h2 className="fw-bold">สิทธิ์การใช้งาน {emp.id_emp} </h2>
        </div>
        <div>
          {availableRoles.length > 0 ? (
            availableRoles.map((role) => (
              <div key={role.role_id} className="form-check form-check-inline">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`role-checkbox-${role.role_id}`}
                  checked={selectedRoles.includes(role.role_id)} // Match roles
                  onChange={() => handleRoleToggle(role)}
                />
                <label
                  htmlFor={`role-checkbox-${role.role_id}`}
                  className="form-check-label fw-bold text-dark"
                >
                  {role.role_name}
                </label>
              </div>
            ))
          ) : (
            <p>No roles available.</p>
          )}
          <hr />
        </div>
        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={saveRoles}>
            Save Changes
          </button>
        </div>
      </div>

    </Modal>
  );
};

export default EditRol;
